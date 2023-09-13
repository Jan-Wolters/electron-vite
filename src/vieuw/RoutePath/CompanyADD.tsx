import CompanyAd from "../MainParts/Company_Add.tsx";
import NavBar from "../components/NavBar";

function Company() {
  return (
    <div className="w-auto  mx-5 overflow-hidden shadow-lg">
      <NavBar />
      <CompanyAd />{" "}
    </div>
  );
}

export default Company;
