import DefaultLayout from "utils/layoutGenerator";
import Header from "components/Header";
import Footer from "components/Footer";

export default DefaultLayout(() => Header(false), Footer);
