import { redirect } from 'next/navigation';
import { getServerSession } from 'next-auth';
import SignInButton from '@/components/SignInButton'

export default async function SignIn() {
  const session = await getServerSession();
  
  // Redirect to home if already signed in
  if (session) {
    redirect('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Welcome to Caption Clash
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Generate and vote on captions for random internet screenshots
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="space-y-4">
            <SignInButton />
          </div>
          
          <div className="text-sm text-center text-gray-600">
            By signing in, you agree to our{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Terms of Service
            </a>
            {' '}and{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
              Privacy Policy
            </a>
          </div>
        </div>
      </div>
    </div>
  );
} 