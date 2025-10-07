import { useState } from 'react';
import { Upload, FileText, Loader } from 'lucide-react';
import { usePDF } from '../context/PDFContext';

const PDFSelector = ({ onPDFSelect }) => {
  const { selectedPDF, setSelectedPDF, pdfList, uploadPDF } = usePDF();
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setUploading(true);
      try {
        const newPDF = await uploadPDF(file);
        setSelectedPDF(newPDF);
        onPDFSelect?.(newPDF);
      } catch (error) {
        alert('Failed to upload PDF. Please try again.');
      } finally {
        setUploading(false);
      }
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handlePDFSelect = (pdf) => {
    setSelectedPDF(pdf);
    onPDFSelect?.(pdf);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Select Your Study Material</h2>
      
      {/* Preset PDFs */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">NCERT Textbooks</h3>
        <div className="grid grid-cols-1 gap-3">
          {pdfList.filter(pdf => pdf.type === 'preset').map(pdf => (
            <button
              key={pdf.id}
              onClick={() => handlePDFSelect(pdf)}
              className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                selectedPDF?.id === pdf.id
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 hover:border-primary-300'
              }`}
            >
              <FileText className="h-5 w-5 text-primary-600 mr-3" />
              <span className="text-sm font-medium text-gray-800">{pdf.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Uploaded PDFs */}
      {pdfList.filter(pdf => pdf.type === 'uploaded').length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Your Uploads</h3>
          <div className="grid grid-cols-1 gap-3">
            {pdfList.filter(pdf => pdf.type === 'uploaded').map(pdf => (
              <button
                key={pdf.id}
                onClick={() => handlePDFSelect(pdf)}
                className={`flex items-center p-3 rounded-lg border-2 transition-all ${
                  selectedPDF?.id === pdf.id
                    ? 'border-primary-500 bg-primary-50'
                    : 'border-gray-200 hover:border-primary-300'
                }`}
              >
                <FileText className="h-5 w-5 text-green-600 mr-3" />
                <span className="text-sm font-medium text-gray-800">{pdf.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Upload Button */}
      <div className="relative">
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileUpload}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={uploading}
        />
        <button
          className="w-full flex items-center justify-center px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-primary-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={uploading}
        >
          {uploading ? (
            <>
              <Loader className="h-5 w-5 mr-2 animate-spin text-primary-600" />
              <span className="text-sm font-medium text-gray-700">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="h-5 w-5 mr-2 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Upload Your PDF</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default PDFSelector;
