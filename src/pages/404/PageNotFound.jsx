import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button";

const PageNotFound = () => {
  const navigate = useNavigate();
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 py-12">
      <div className="w-full max-w-lg text-center">
        <div className="mb-6">
          <span className="text-8xl font-extrabold tracking-tight text-[#cd2121] sm:text-9xl">
            404
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          Page not found
        </h1>

        <p className="mx-auto mt-4 max-w-md text-base leading-7 text-gray-500 sm:text-lg">
          Sorry, the page you are looking for doesn't exist or may have been
          moved.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button
            text="Go Back"
            onClick={() => navigate(-1)}
            className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-5 py-3 text-sm font-semibold text-gray-700 transition-all duration-200 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2 sm:w-auto cursor-pointer"
          />
        </div>
      </div>
    </main>
  );
};

export default PageNotFound;
