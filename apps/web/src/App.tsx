import CourseGrid from "./components/CourseGrid";
import './index.css'
export default function App() {
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <h1 className="mb-8 text-2xl font-semibold">Course Title Generator</h1>
      <CourseGrid />
    </div>
  );
}
