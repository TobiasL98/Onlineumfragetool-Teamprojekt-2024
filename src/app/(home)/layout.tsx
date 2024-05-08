import DefaultLayout from "utils/layoutGenerator";
import Header from "app/components/Header";
import Footer from "app/components/Footer";

export default DefaultLayout(() => Header(false), Footer);
