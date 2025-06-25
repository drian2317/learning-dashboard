import React, { useState } from 'react';
import { FaUpload, FaTrash, FaFileAlt, FaFilePdf, FaFileImage, FaFileWord, FaFileExcel } from 'react-icons/fa';
import Button from '../../components/ui/Button';
import { toast } from 'react-hot-toast';

const Uploads = () => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const getFileIcon = (fileType) => {
    if (fileType.includes('pdf')) return <FaFilePdf className="text-red-500" />;
    if (fileType.includes('image')) return <FaFileImage className="text-blue-500" />;
    if (fileType.includes('word')) return <FaFileWord className="text-blue-600" />;
    if (fileType.includes('excel') || fileType.includes('sheet')) return <FaFileExcel className="text-green-600" />;
    return <FaFileAlt className="text-gray-500" />;
  };

  const handleFileUpload = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length === 0) return;

    setUploading(true);
    
    // Simulate upload
    setTimeout(() => {
      setFiles(prev => [...prev, ...selectedFiles.map(file => ({
        name: file.name,
        size: file.size,
        type: file.type,
        lastModified: file.lastModified,
        preview: URL.createObjectURL(file)
      }))]);
      toast.success(`${selectedFiles.length} files uploaded successfully!`);
      setUploading(false);
    }, 1500);
  };

  const removeFile = (index) => {
    URL.revokeObjectURL(files[index].preview);
    setFiles(prev => prev.filter((_, i) => i !== index));
    toast.success('File removed');
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">My Uploads</h1>
        <label className="cursor-pointer">
          <Button 
            variant="primary" 
            icon={<FaUpload />}
            loading={uploading}
          >
            Upload Files
            <input 
              type="file" 
              className="hidden" 
              onChange={handleFileUpload}
              multiple
            />
          </Button>
        </label>
      </div>

      {files.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b bg-gray-50 font-medium">
            <div className="col-span-6">File Name</div>
            <div className="col-span-2">Type</div>
            <div className="col-span-2">Size</div>
            <div className="col-span-2">Actions</div>
          </div>
          
          {files.map((file, index) => (
            <div key={index} className="grid grid-cols-12 gap-4 p-4 border-b hover:bg-gray-50 items-center">
              <div className="col-span-6 flex items-center">
                <span className="mr-3">
                  {getFileIcon(file.type)}
                </span>
                <span className="truncate">{file.name}</span>
              </div>
              <div className="col-span-2 text-sm text-gray-600">
                {file.type || 'Unknown'}
              </div>
              <div className="col-span-2 text-sm text-gray-600">
                {(file.size / 1024).toFixed(1)} KB
              </div>
              <div className="col-span-2">
                <Button
                  variant="danger"
                  size="sm"
                  icon={<FaTrash />}
                  onClick={() => removeFile(index)}
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <FaUpload className="text-3xl text-gray-400" />
          </div>
          <h3 className="text-xl font-bold mb-2">No files uploaded yet</h3>
          <p className="text-gray-600 mb-6">
            Upload your lesson materials, documents, or media files to share with students
          </p>
          <label className="cursor-pointer inline-block">
            <Button 
              variant="primary"
              icon={<FaUpload />}
            >
              Upload Files
              <input 
                type="file" 
                className="hidden" 
                onChange={handleFileUpload}
                multiple
              />
            </Button>
          </label>
        </div>
      )}
    </div>
  );
};

export default Uploads;