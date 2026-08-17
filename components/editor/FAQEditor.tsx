import { FC } from "react";

export interface FAQ {
  question: string;
  answer: string;
}

interface Props {
  value: FAQ[];
  onChange: (faqs: FAQ[]) => void;
}

const FAQEditor: FC<Props> = ({ value, onChange }) => {
  const addFaq = () => {
    onChange([...value, { question: "", answer: "" }]);
  };

  const updateFaq = (index: number, field: "question" | "answer", text: string) => {
    onChange(value.map((faq, i) => (i === index ? { ...faq, [field]: text } : faq)));
  };

  const removeFaq = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      {value.map((faq, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-3 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500">Câu hỏi {index + 1}</span>
            <button
              type="button"
              onClick={() => removeFaq(index)}
              className="text-red-400 hover:text-red-600 text-xs transition-colors"
            >
              Xóa
            </button>
          </div>
          <input
            type="text"
            value={faq.question}
            onChange={(e) => updateFaq(index, "question", e.target.value)}
            placeholder="Câu hỏi..."
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#105d97] focus:border-transparent outline-none"
          />
          <textarea
            value={faq.answer}
            onChange={(e) => updateFaq(index, "answer", e.target.value)}
            placeholder="Trả lời..."
            rows={2}
            className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-[#105d97] focus:border-transparent outline-none resize-none"
          />
        </div>
      ))}
      <button
        type="button"
        onClick={addFaq}
        className="w-full py-2 text-sm border border-dashed border-[#105d97] text-[#105d97] rounded-lg hover:bg-blue-50 transition-colors"
      >
        + Thêm câu hỏi
      </button>
    </div>
  );
};

export default FAQEditor;
