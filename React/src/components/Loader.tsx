import { useAppSelector } from "@/store";
import { BeatLoader } from "react-spinners";

const Loader = () => {
  const loading = useAppSelector((state) => state.loader);

  return (
    (loading) && (
     
        <BeatLoader
          size={60}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
    
    )
  );
};

export default Loader;
