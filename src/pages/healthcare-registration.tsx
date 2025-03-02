import { NextPage } from 'next';
import HealthcareProfessionalForm from '../components/HealthcareProfessionalForm';

const HealthcareRegistrationPage: NextPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <HealthcareProfessionalForm />
      </div>
    </div>
  );
};

export default HealthcareRegistrationPage;