import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { openLoader, hideLoader } from "@/store/features/loaderSlice";
import api from "@/api";
import Loader from "@/components/Loader";
import useAuth from "@/hooks/useAuth";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type LoginForm = z.infer<typeof loginSchema>;

const LoginView = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userLogin } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const { mutate, isPending } = api.login.login.useMutation({
    onSuccess: (data) => {
      userLogin(data.data);
      navigate("/");
    },
    onError: (err: Error) => {
      setError(err.message || "Login failed");
    },
  });

  const [error, setError] = React.useState<string | null>(null);

  useEffect(() => {
    if (isPending) dispatch(openLoader());
    else dispatch(hideLoader());
  }, [isPending, dispatch]);

  const onSubmit = (data: LoginForm) => {
    setError(null);
    mutate(data);
  };

  return (
    <>
      {isPending && (
        <div className="fixed inset-0 z-50 flex justify-center items-center">
          <Loader />
        </div>
      )}
      <div className="relative z-10 bg-gradient-to-r from-blue-400 to-green-400 shadow-xl rounded-4xl w-full max-w-md p-8 space-y-6">
        <h2 className="text-3xl font-bold text-gray-900 text-center">Welcome Back</h2>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form
          className="space-y-4 text-gray-900 sm:text-1xl"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="block mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="w-full px-4 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block mb-1" htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              className="w-full px-4 py-2 border border-gray-900 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
              placeholder="Enter your password"
              {...register("password")}
            />
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              Remember me
            </label>
            <a href="#" className="text-black hover:underline">Forgot password?</a>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition duration-200"
            disabled={isPending}
          >
            {isPending ? "Logging in..." : "Login"}
          </button>
        </form>

        <button
          onClick={() => navigate("/Auth/register")}
          className="text-black hover:underline"
        >
          Don't have an account? Register
        </button>
      </div>
    </>
  );
};

export default LoginView;
