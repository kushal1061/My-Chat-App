import React from 'react';
import { useRef, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MessageSquare } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import ThemeToggle from '../components/ui/ThemeToggle';
import { User, Mail, Phone } from 'lucide-react';

function Register() {
  const name = useRef();
  const pass = useRef();
  const phoneRef = useRef();
  const emailRef = useRef();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async () => {
    if (!name.current.value || !pass.current.value || !phoneRef.current.value || !emailRef.current.value) {
      toast.error('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/user/register', {
        name: name.current.value,
        password: pass.current.value,
        phone: phoneRef.current.value,
        email: emailRef.current.value,
      });

      if (res.status === 200 || res.status === 201) {
        toast.success('Account created! Please sign in.');
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-surface-secondary">
      {/* Theme toggle */}
      <div className="fixed top-4 right-4 z-20">
        <ThemeToggle />
      </div>

      {/* Left branding panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center p-12 bg-accent relative overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-white/5 rounded-full translate-x-1/3 translate-y-1/3" />
        <div className="absolute top-1/3 right-1/4 w-24 h-24 bg-white/5 rounded-2xl rotate-12" />

        <div className="relative z-10 text-center space-y-6 max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center mx-auto backdrop-blur-sm">
            <MessageSquare size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white text-balance leading-tight">
            Join the Conversation
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            Create your account in seconds and start connecting with your peers.
          </p>
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile branding */}
          <div className="lg:hidden flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <MessageSquare size={20} className="text-text-inverse" />
            </div>
            <span className="font-bold text-xl text-text-primary tracking-tight">My Chat</span>
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-text-primary tracking-tight">Create Account</h2>
            <p className="text-text-secondary text-sm">
              Join us and start messaging today
            </p>
          </div>

          <form
            className="space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              handleRegister();
            }}
          >
            <Input
              ref={name}
              type="text"
              label="Username"
              icon={User}
              placeholder="Choose a username"
            />
            <Input
              ref={pass}
              type="password"
              label="Password"
              placeholder="Create a password"
            />
            <Input
              ref={emailRef}
              type="email"
              label="Email"
              icon={Mail}
              placeholder="you@email.com"
            />
            <Input
              ref={phoneRef}
              type="tel"
              label="Phone"
              icon={Phone}
              placeholder="Phone number"
            />
            <Button
              type="submit"
              loading={isLoading}
              className="w-full"
              size="lg"
            >
              Create Account
            </Button>
          </form>

          <p className="text-center text-sm text-text-secondary">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent font-semibold hover:text-accent-hover transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
