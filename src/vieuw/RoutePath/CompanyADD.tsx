import CompanyAd from "../MainParts/Company_Add.tsx";
import NavBar from "../components/NavBar";

function Company() {
  return (
    <div className="className=w-75 mx-auto container overflow-hidden shadow-lg">
      <NavBar />
      <CompanyAd />{" "}
    </div>
  );
}

export default Company;
