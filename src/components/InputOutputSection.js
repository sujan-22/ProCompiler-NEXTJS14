import { Textarea } from "./ui/textarea";

const InputOutputSection = ({ input, setInput, output }) => {
    return (
        <div className="flex flex-col space-y-2">
            <textarea
                className="border p-2 h-[400px] rounded"
                placeholder="Output"
                value={output}
                readOnly
            />
            <textarea
                className="border p-2 h-[160px] rounded"
                placeholder="Input"
                value={input}
                onChange={(e) => setInput(e.target.value)}
            />
        </div>
    );
};

export default InputOutputSection;
