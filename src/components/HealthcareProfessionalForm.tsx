'use client';
import { useState } from 'react';
import supabase  from '../../supabase';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Input,
  Select,
  Textarea,
  useToast,
  Alert,
  AlertIcon,
} from '@chakra-ui/react';

interface HealthcareProfessional {
  full_name: string;
  profile_photo: string;
  gender: string;
  date_of_birth: string;
  medical_license_number: string;
  specialization: string;
  years_of_experience: number;
  educational_qualifications: string;
  certifications: string;
  clinic_hospital_name: string;
  location: string;
  available_consultation_hours: string;
  mode_of_consultation: string;
  phone_number: string;
  email_id: string;
  whatsapp_number: string;
  fee_structure: string;
  payment_methods: string;
  types_of_treatments: string;
  medical_certificates: string;
  short_bio: string;
  languages_spoken: string;
  website_or_social_media: string;
}

export default function HealthcareProfessionalForm() {
  const [formData, setFormData] = useState<HealthcareProfessional>({
    full_name: '',
    profile_photo: '',
    gender: '',
    date_of_birth: '',
    medical_license_number: '',
    specialization: '',
    years_of_experience: 0,
    educational_qualifications: '',
    certifications: '',
    clinic_hospital_name: '',
    location: '',
    available_consultation_hours: '',
    mode_of_consultation: '',
    phone_number: '',
    email_id: '',
    whatsapp_number: '',
    fee_structure: '',
    payment_methods: '',
    types_of_treatments: '',
    medical_certificates: '',
    short_bio: '',
    languages_spoken: '',
    website_or_social_media: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const toast = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'years_of_experience' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { data, error } = await supabase
        .from('healthcare_professionals')
        .insert([formData])
        .select();

      if (error) throw error;
      
      setSuccess(true);
      setFormData({
        full_name: '',
        profile_photo: '',
        gender: '',
        date_of_birth: '',
        medical_license_number: '',
        specialization: '',
        years_of_experience: 0,
        educational_qualifications: '',
        certifications: '',
        clinic_hospital_name: '',
        location: '',
        available_consultation_hours: '',
        mode_of_consultation: '',
        phone_number: '',
        email_id: '',
        whatsapp_number: '',
        fee_structure: '',
        payment_methods: '',
        types_of_treatments: '',
        medical_certificates: '',
        short_bio: '',
        languages_spoken: '',
        website_or_social_media: '',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxW="6xl" py={8}>
      <Box bg="white" p={8} borderRadius="lg" boxShadow="lg">
        <Heading as="h2" size="lg" textAlign="center" mb={8}>
          Healthcare Professional Registration
        </Heading>
        
        {error && (
          <Alert status="error" mb={4} borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}
        
        {success && (
          <Alert status="success" mb={4} borderRadius="md">
            <AlertIcon />
            Registration successful!
          </Alert>
        )}

        <form onSubmit={handleSubmit}>
          <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={6}>
            <FormControl isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Profile Photo URL</FormLabel>
              <Input
                type="url"
                name="profile_photo"
                value={formData.profile_photo}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Gender</FormLabel>
              <Select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                placeholder="Select Gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                name="date_of_birth"
                value={formData.date_of_birth}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Medical License Number</FormLabel>
              <Input
                name="medical_license_number"
                value={formData.medical_license_number}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Specialization</FormLabel>
              <Input
                name="specialization"
                value={formData.specialization}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Years of Experience</FormLabel>
              <Input
                type="number"
                name="years_of_experience"
                value={formData.years_of_experience}
                onChange={handleChange}
                min="0"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Educational Qualifications</FormLabel>
              <Textarea
                name="educational_qualifications"
                value={formData.educational_qualifications}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Certifications</FormLabel>
              <Textarea
                name="certifications"
                value={formData.certifications}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Clinic/Hospital Name</FormLabel>
              <Input
                name="clinic_hospital_name"
                value={formData.clinic_hospital_name}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Location</FormLabel>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Available Consultation Hours</FormLabel>
              <Input
                name="available_consultation_hours"
                value={formData.available_consultation_hours}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Mode of Consultation</FormLabel>
              <Select
                name="mode_of_consultation"
                value={formData.mode_of_consultation}
                onChange={handleChange}
                placeholder="Select Mode"
              >
                <option value="in-person">In-Person</option>
                <option value="online">Online</option>
                <option value="both">Both</option>
              </Select>
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Email ID</FormLabel>
              <Input
                type="email"
                name="email_id"
                value={formData.email_id}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>WhatsApp Number</FormLabel>
              <Input
                type="tel"
                name="whatsapp_number"
                value={formData.whatsapp_number}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Fee Structure</FormLabel>
              <Textarea
                name="fee_structure"
                value={formData.fee_structure}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Payment Methods</FormLabel>
              <Input
                name="payment_methods"
                value={formData.payment_methods}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Types of Treatments</FormLabel>
              <Textarea
                name="types_of_treatments"
                value={formData.types_of_treatments}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Medical Certificates</FormLabel>
              <Textarea
                name="medical_certificates"
                value={formData.medical_certificates}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Short Bio</FormLabel>
              <Textarea
                name="short_bio"
                value={formData.short_bio}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Languages Spoken</FormLabel>
              <Input
                name="languages_spoken"
                value={formData.languages_spoken}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Website or Social Media</FormLabel>
              <Input
                type="url"
                name="website_or_social_media"
                value={formData.website_or_social_media}
                onChange={handleChange}
              />
            </FormControl>
          </Grid>

          <Box display="flex" justifyContent="center" mt={8}>
            <Button
              type="submit"
              colorScheme="blue"
              isLoading={loading}
              loadingText="Submitting..."
              size="lg"
              px={8}
            >
              Submit
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
} 