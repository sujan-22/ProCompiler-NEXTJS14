import Docker from "dockerode";
import { NextResponse } from "next/server";

// const docker = new Docker();

// const executeCode = async (language, code) => {
//     let imageName;
//     switch (language) {
//         case "javascript":
//             imageName = "node:latest";
//             break;
//         case "python":
//             imageName = "python:latest";
//             break;
//         case "cpp":
//             imageName = "gcc:latest";
//             break;
//         default:
//             console.error("Unsupported language:", language);
//             return "Unsupported language";
//     }

//     try {
//         const container = await docker.createContainer({
//             Image: imageName,
//             Cmd:
//                 language === "cpp"
//                     ? ["bash", "-c", `echo "${code}" | g++ -o temp && ./temp`]
//                     : ["bash", "-c", `echo "${code}" | ${language}`],
//             AttachStdout: true,
//             AttachStderr: true,
//             Tty: true,
//         });

//         await container.start();
//         const stream = await container.logs({
//             follow: true,
//             stdout: true,
//             stderr: true,
//         });

//         let output = "";

//         stream.on("data", (chunk) => {
//             output += chunk.toString();
//         });

//         await new Promise((resolve) => stream.on("end", resolve));
//         await container.stop();
//         await container.remove();

//         return output;
//     } catch (error) {
//         console.error("Error executing code in Docker container:", error);
//         throw new Error("Error executing code");
//     }
// };

// Function to execute code in a Docker container
async function executeCode(language, code) {
    // Map of language names to Docker image names
    const languageToImage = {
        javascript: "node:latest",
        python: "python:latest",
        // Add mappings for other languages as needed
    };

    // Get the Docker image name for the specified language
    const imageName = languageToImage[language];
    if (!imageName) {
        return Promise.reject(new Error("Language not supported"));
    }

    // Create a Docker client
    const docker = new Docker();

    // Create a container
    const container = await docker.createContainer({
        Image: imageName,
        Tty: false,
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        OpenStdin: true,
        StdinOnce: false,
    });

    // Start the container
    await container.start();

    const command = {
        javascript: ["node"],
        python: ["python"],
        // Add commands for other languages
    }[language];

    if (!command) {
        return Promise.reject(new Error("Language not supported"));
    }

    // Attach to the container's standard input, output, and error streams
    const exec = await container.exec({
        Cmd: command, // Command will be provided later
        AttachStdin: true,
        AttachStdout: true,
        AttachStderr: true,
        Tty: false,
        Privileged: false,
    });

    // Write the code to the container's standard input
    await exec
        .start({
            stdin: true,
            hijack: true,
        })
        .then((stdin) => {
            stdin.write(code);
            stdin.end();
        });

    // Wait for the code to execute and capture the output
    const output = await new Promise((resolve, reject) => {
        exec.start(
            {
                hijack: true,
                stdin: false,
                Tty: false,
            },
            (err, stream) => {
                if (err) {
                    reject(err);
                    return;
                }
                let output = "";
                stream.on("data", (chunk) => {
                    output += chunk.toString();
                });
                stream.on("end", () => {
                    resolve(output);
                });
            }
        );
    });

    // Remove the container
    await container.remove({ force: true });

    return output;
}

export async function POST(request) {
    const body = await request.json();
    const { language, code } = body;
    const output = await executeCode(language, code);
    return NextResponse.json({
        output: output,
        message: code,
    });
}
