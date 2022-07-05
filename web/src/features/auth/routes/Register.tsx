import { useNavigate } from 'react-router-dom';

// import { CreateUser } from '@/features/users';
// import { ContentLayout } from '@/components/Layout';

export const Register = () => {
  const navigate = useNavigate();

  return (
    // <ContentLayout title="Register your account">
    //   <CreateUser onSuccess={() => navigate('/auth')} />
    // </ContentLayout>
    <h1>Register</h1>
  );
}