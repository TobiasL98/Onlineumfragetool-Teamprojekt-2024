import DefaultLayout from "utils/layoutGenerator";
import Header from "components/Header";

const AdminLayout = DefaultLayout(() => <Header admin={false} />);

export default AdminLayout;
