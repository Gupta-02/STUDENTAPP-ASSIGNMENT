import { useState } from 'react';
import { FileText, Upload, Trash2, Eye, CheckSquare, Square } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { PDF } from '../lib/storage';

export function Library() {
  const { pdfs, selectedPdfIds, setSelectedPdfIds, addPDF, deletePDF } = useApp();
  const viewMode = 'grid';
  const [selectedPdf, setSelectedPdf] = useState<PDF | null>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      try {
        // Create FormData for file upload
        const formData = new FormData();
        formData.append('pdf', file);

        // Upload to backend
        const response = await fetch('/api/upload-pdf', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();

          // Create PDF object with backend data
          const newPdf: PDF = {
            id: `pdf-${Date.now()}`, // Use filename as ID for backend reference
            title: file.name.replace('.pdf', ''),
            filePath: data.url, // Use backend URL
            pageCount: 0, // Will be updated after processing
            isSeeded: false,
            uploadedAt: new Date().toISOString(),
            backendId: data.filename, // Store backend filename for API calls
          };

          addPDF(newPdf);
          alert('PDF uploaded and is being processed. Questions will be generated from its content.');
        } else {
          throw new Error('Upload failed');
        }
      } catch (error) {
        console.error('Upload error:', error);
        alert('Failed to upload PDF. Please try again.');
      }
    }

    // Clear the input
    e.target.value = '';
  };

  const togglePdfSelection = (pdfId: string) => {
    if (selectedPdfIds.includes(pdfId)) {
      setSelectedPdfIds(selectedPdfIds.filter(id => id !== pdfId));
    } else {
      setSelectedPdfIds([...selectedPdfIds, pdfId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPdfIds.length === pdfs.length) {
      setSelectedPdfIds([]);
    } else {
      setSelectedPdfIds(pdfs.map(p => p.id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h2 className="text-2xl font-bold text-black">PDF Library</h2>
            <p className="text-gray-600 mt-1">
              {selectedPdfIds.length > 0
                ? `${selectedPdfIds.length} PDF${selectedPdfIds.length > 1 ? 's' : ''} selected`
                : 'Select PDFs to use for study'}
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={toggleSelectAll}
              className="px-4 py-2 border-2 border-black rounded-lg hover:bg-black hover:text-white transition-colors flex items-center gap-2"
            >
              {selectedPdfIds.length === pdfs.length ? (
                <>
                  <Square className="w-4 h-4" />
                  Deselect All
                </>
              ) : (
                <>
                  <CheckSquare className="w-4 h-4" />
                  Select All
                </>
              )}
            </button>
            <label className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Upload PDF
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <div className="bg-gray-100 border-2 border-black rounded-lg p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="font-medium text-black">Source:</span>
            {selectedPdfIds.length === 0 && (
              <span className="text-gray-600">No PDFs selected</span>
            )}
            {selectedPdfIds.length === pdfs.length && (
              <span className="text-black font-medium">All uploaded PDFs</span>
            )}
            {selectedPdfIds.length > 0 && selectedPdfIds.length < pdfs.length && (
              <span className="text-black font-medium">
                {selectedPdfIds.length} specific PDF{selectedPdfIds.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
        {pdfs.map((pdf) => {
          const isSelected = selectedPdfIds.includes(pdf.id);
          return (
            <div
              key={pdf.id}
              className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                isSelected
                  ? 'border-black bg-gray-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onClick={() => togglePdfSelection(pdf.id)}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-start gap-3 flex-1">
                  <div className={`p-2 rounded-lg ${isSelected ? 'bg-black text-white' : 'bg-gray-200 text-black'}`}>
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-black truncate">{pdf.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {pdf.pageCount > 0 ? `${pdf.pageCount} pages` : 'PDF Document'}
                    </p>
                    {pdf.isSeeded && (
                      <span className="inline-block text-xs bg-black text-white px-2 py-1 rounded mt-2">
                        NCERT
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1 ml-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPdf(pdf);
                    }}
                    className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                    title="View PDF"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  {!pdf.isSeeded && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm('Delete this PDF?')) {
                          deletePDF(pdf.id);
                        }
                      }}
                      className="p-2 hover:bg-red-100 text-red-600 rounded-lg transition-colors"
                      title="Delete PDF"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-gray-200">
                <span className="text-xs text-gray-500">
                  {new Date(pdf.uploadedAt).toLocaleDateString()}
                </span>
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                  isSelected ? 'bg-black border-black' : 'border-gray-300'
                }`}>
                  {isSelected && <CheckSquare className="w-4 h-4 text-white" />}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {selectedPdf && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedPdf(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b-2 border-black">
              <h3 className="font-bold text-black">{selectedPdf.title}</h3>
              <button
                onClick={() => setSelectedPdf(null)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 h-[calc(90vh-80px)] overflow-auto">
              <iframe
                src={selectedPdf.filePath}
                className="w-full h-full border-2 border-gray-300 rounded-lg"
                title={selectedPdf.title}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
