import { Textarea } from "./ui/textarea";

const InputOutputSection = ({ input, setInput, output }) => {
    return (
        <div className="flex flex-col space-y-2 mt-2">
            <textarea
                className="border p-2 rounded"
                placeholder="Input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
            <textarea
                className="border p-2 rounded"
                placeholder="Output"
                value={output}
                readOnly
            />
        </div>
    );
};

export default InputOutputSection;
