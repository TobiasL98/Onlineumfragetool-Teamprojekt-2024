import DefaultLayout from "utils/layoutGenerator";
import Header from "components/Header";


const AdminLayout = DefaultLayout(() => <Header admin={true} />);

export default AdminLayout;
