import { number } from "zod";
import "./Loading.css";
interface LoadingProps {
  height?: number;
}
const Loading = ({ height }: LoadingProps) => {
  return (
    <div className="center">
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
      <div
        className="wave"
        style={{
          height: height ? height : 100,
        }}
      ></div>
    </div>
  );
};

export default Loading;
