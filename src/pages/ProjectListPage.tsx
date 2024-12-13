import Header from "@components/sections/Header";

/**
 * 첫 프로젝트 리스트 화면입니다.
 */
function ProjectListPage() {
  return (
    <div className="box-border h-screen mx-40 py-10">
      <Header
        title={"프로젝트"}
        buttonLabel={"생성하기"}
        onClick={() => console.log("생성")}
      />
    </div>
  );
}

export default ProjectListPage;
