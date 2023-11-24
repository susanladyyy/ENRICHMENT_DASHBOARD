import NavBar from "./components/NavBar";

export default function Dashboard() {
  return(    
    <>
      <NavBar />
      <hr />
      <div className="content my-[50px] mx-[80px]">
        <div className="header">
          <p className="text-4xl text-bold">Dashboard</p>
        </div>
      </div>
    </>
  );
}