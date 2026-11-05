import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Ura07ChiisanaGouman, Ura08KimerarenaiWatashi } from "./Composition";
import { DURATION_IN_FRAMES, FPS } from "./ura07/script";
import { DURATION_IN_FRAMES as URA08_DURATION, FPS as URA08_FPS } from "./ura08/script";

// Each <Composition> is an entry in the sidebar!

export const RemotionRoot: React.FC = () => {
  return (
    <>
      {/* ura-07「小さな傲慢に気づいた夜」 9:16 short.
          npx remotion render Ura07ChiisanaGouman out/ura-07.mp4 */}
      <Composition
        id="Ura07ChiisanaGouman"
        component={Ura07ChiisanaGouman}
        durationInFrames={DURATION_IN_FRAMES}
        fps={FPS}
        width={1080}
        height={1920}
      />
      {/* ura-08「自分で決められない私」 9:16 short, on Gemini footage.
          npx remotion render Ura08KimerarenaiWatashi out/ura-08.mp4 */}
      <Composition
        id="Ura08KimerarenaiWatashi"
        component={Ura08KimerarenaiWatashi}
        durationInFrames={URA08_DURATION}
        fps={URA08_FPS}
        width={1080}
        height={1920}
      />
      <Folder name="Elements">
        <Composition
          id="Logo"
          component={Logo}
          durationInFrames={150}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            logoColor1: "#91EAE4",
            logoColor2: "#86A8E7",
          }}
        />
        <Composition
          id="Title"
          component={Title}
          durationInFrames={115}
          fps={30}
          width={1920}
          height={1080}
          defaultProps={{
            titleText: "Welcome to Remotion",
            titleColor: "#000000",
          }}
        />
      </Folder>
      <Composition
        // You can take the "id" to render a video:
        // bunx remotion render HelloWorld
        id="HelloWorld"
        component={HelloWorld}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
        // You can override these props for each render:
        // https://www.remotion.dev/docs/parametrized-rendering
        defaultProps={{
          titleText: "Welcome to Remotion",
          titleColor: "#000000",
        }}
      />

    </>
  );
};
