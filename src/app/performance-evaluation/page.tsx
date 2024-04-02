import DropdownSelect from "@/components/DropdownSelect";

export default function PerformanceEvaluation() {
  // dropdown variable
  const rating = ["met", "not met", "exceeded"];
  const placeholder = "Select rating";
  // form variable
  const jobResponsibilities = ["live", "love", "laugh"];

  return (
    <>
      <form>
        {jobResponsibilities.map((job, index) => {
          return (
            <div key={index}>
              <p>{job}</p>
              <DropdownSelect options={rating} placeholder={placeholder} />
            </div>
          );
        })}
        <div>
          <input type="submit" value="submit" />
        </div>
      </form>
    </>
  );
}
