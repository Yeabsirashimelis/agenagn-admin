import { ClipLoader } from "react-spinners";

const override = {
    display: "block",
    margin: "0 auto",
    borderColor: "red",
  };

  export default function Spinner({loading}: {loading:boolean}) {  
    return (
        <div className="flex justify-center items-center h-screen">
      <ClipLoader
        color={"#000"}  
        loading={loading}
        cssOverride={override}
        size={150}
        aria-label="Loading Spinner"
        data-testid="loader"
      />
        </div>
    );
}