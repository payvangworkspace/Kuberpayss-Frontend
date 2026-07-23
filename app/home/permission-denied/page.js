import Wrapper from "../components/wrapper/Wrapper";

const PermissionDenied = () => {
  return (
    <Wrapper pagename="Permission Denied">
      <div className="wrapper text-center">
        <h6 className="text-danger">Access Denied</h6>
        <small>You are not authorised to access this page</small>
      </div>
    </Wrapper>
  );
};

export default PermissionDenied;
