import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { FileText, ArrowLeft, Download } from 'lucide-react';

interface DietPlanProps {
  planHtml: string;
  onBack: () => void;
}

export default function DietPlan({ planHtml, onBack }: DietPlanProps) {
  const planRef = useRef<HTMLDivElement>(null);

  const handleDownloadPdf = () => {
    const input = planRef.current;
    if (input) {
      // Add a temporary class to ensure the background is not transparent for the capture
      input.classList.add('bg-gray-900');

      html2canvas(input, {
        useCORS: true,
        scale: 2,
        backgroundColor: null, // Use the element's background
      }).then((canvas) => {
        // Remove the temporary class after capture
        input.classList.remove('bg-gray-900');

        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'px',
          format: [canvas.width, canvas.height],
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save('diet-plan.pdf');
      });
    }
  };
  return (
    <>
      <style jsx global>{`
        .nutrition-summary {
          display: flex;
          justify-content: space-around;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.05);
          padding: 1.5rem;
          border-radius: 0.75rem;
          margin-bottom: 2rem;
          border: 1px solid rgba(255, 255, 255, 0.1);
          flex-wrap: wrap;
          gap: 1rem;
        }
        .summary-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          flex-grow: 1;
          min-width: 80px;
        }
        .summary-item .icon {
          font-size: 2rem;
          line-height: 1;
          margin-bottom: 0.5rem;
        }
        .summary-item .value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #fff;
          line-height: 1;
        }
        .summary-item .label {
          font-size: 0.875rem;
          color: #9ca3af; /* text-gray-400 */
          margin-top: 0.25rem;
        }
      `}</style>
      <div className="w-full max-w-5xl p-8 sm:p-10 space-y-8 bg-gray-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/10 animate-fade-in">
        <div ref={planRef} className="p-8 rounded-lg">
          <div className="text-center">
            <FileText className="mx-auto h-10 w-10 text-indigo-400" />
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-4xl">Your Personalized Diet Plan</h2>
            <p className="mt-2 text-lg leading-8 text-gray-400">Crafted by AI to help you reach your goals.</p>
          </div>
          <div
            className="mt-8 prose prose-sm sm:prose-base max-w-none prose-invert \
                       prose-headings:text-indigo-300 prose-table:w-full prose-table:border-collapse \
                       prose-table:border prose-table:border-white/10 prose-table:rounded-lg prose-table:overflow-hidden \
                       prose-th:bg-white/5 prose-th:p-3 prose-th:text-left prose-th:font-semibold prose-th:text-indigo-300 \
                       prose-td:p-3 prose-td:border-t prose-td:border-white/10 \
                       prose-ul:list-disc prose-ul:pl-6 prose-strong:text-white"
            dangerouslySetInnerHTML={{ __html: planHtml }}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-6">
          <button
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            <ArrowLeft className="h-5 w-5" />
            Create a New Plan
          </button>
          <button
            onClick={handleDownloadPdf}
            className="w-full flex items-center justify-center gap-2 py-3 px-4 font-semibold text-indigo-300 bg-gray-800/50 border border-gray-700 hover:bg-gray-700/70 rounded-lg shadow-lg transform hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
          >
            <Download className="h-5 w-5" />
            Download PDF
          </button>
        </div>
      </div>
    </>
  );
}
