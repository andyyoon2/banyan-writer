import type { Component } from "solid-js";
import { BanyanProvider } from "./components/BanyanContext";
import { Documents } from "./components/Documents";

const App: Component = () => {
	return (
    <BanyanProvider>
      <main class="p-4">
        <h1 class="font-semibold">Banyan Writer</h1>
        <Documents />
      </main>
    </BanyanProvider>
  );
};

export default App;
