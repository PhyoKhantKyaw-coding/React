import { useAppSelector } from "@/store";
import { useIsFetching } from "@tanstack/react-query";
import { BeatLoader } from "react-spinners";

const Loader = () => {
  const isFetching = useIsFetching();
  const loading = useAppSelector((state) => state.loader);

  return (
    (isFetching || loading) && ( 
        <BeatLoader
          size={60}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
    )
  );
};

export default Loader;
