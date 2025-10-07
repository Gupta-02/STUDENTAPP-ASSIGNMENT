import { createContext, useContext, useState } from 'react';

const PDFContext = createContext();

export const usePDF = () => {
  const context = useContext(PDFContext);
  if (!context) {
    throw new Error('usePDF must be used within PDFProvider');
  }
  return context;
};

export const PDFProvider = ({ children }) => {
  const [selectedPDF, setSelectedPDF] = useState(null);
  const [pdfList, setPdfList] = useState([
    { id: 1, name: 'NCERT Physics Class 11', url: '/pdfs/ncert-physics-11.pdf', type: 'preset' },
    { id: 2, name: 'NCERT Chemistry Class 11', url: '/pdfs/ncert-chemistry-11.pdf', type: 'preset' },
    { id: 3, name: 'NCERT Mathematics Class 11', url: '/pdfs/ncert-math-11.pdf', type: 'preset' },
  ]);

  const uploadPDF = async (file) => {
    const formData = new FormData();
    formData.append('pdf', file);

    try {
      const response = await fetch('/api/upload-pdf', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      const newPDF = {
        id: Date.now(),
        name: file.name,
        url: data.url,
        type: 'uploaded',
      };
      setPdfList([...pdfList, newPDF]);
      return newPDF;
    } catch (error) {
      console.error('Error uploading PDF:', error);
      throw error;
    }
  };

  return (
    <PDFContext.Provider value={{ selectedPDF, setSelectedPDF, pdfList, uploadPDF }}>
      {children}
    </PDFContext.Provider>
  );
};
