import { type Component } from "solid-js";
import { BanyanProvider } from "./components/BanyanContext";
import { Documents } from "./components/Documents";

const App: Component = () => {
  return (
    <BanyanProvider>
      <p class="text-4xl text-green-700 text-center py-20">Hello tailwind!</p>
      <Documents />
    </BanyanProvider>
  );
};

export default App;
