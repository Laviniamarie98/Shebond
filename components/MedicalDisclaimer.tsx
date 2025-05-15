import { FaInfoCircle } from 'react-icons/fa';

export default function MedicalDisclaimer() {
  return (
    <div className="bg-amber-50 border-l-4 border-amber-900 p-4 my-4">
      <div className="flex items-start">
        <FaInfoCircle className="text-amber-900 mt-1 mr-3" />
        <div>
          <p className="text-sm text-amber-900">
            <strong>Medical Disclaimer:</strong> The information provided is for general informational and educational purposes only. 
            It is not a substitute for professional medical advice, diagnosis, or treatment. 
            Always seek the advice of your physician or other qualified healthcare provider with any questions you may have.
          </p>
        </div>
      </div>
    </div>
  );
} 