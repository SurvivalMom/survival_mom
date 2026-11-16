import { Composition, Folder } from "remotion";
import { HelloWorld } from "./HelloWorld";
import { Logo } from "./HelloWorld/Logo";
import { Title } from "./HelloWorld/Title";
import { Ura07ChiisanaGouman, Ura08KimerarenaiWatashi, Ura09MataKikiniItta, Ura10HitoriDeKimetaYoru, Ura11KikikaesaretaToki } from "./Composition";
import { DURATION_IN_FRAMES, FPS } from "./ura07/script";
import { DURATION_IN_FRAMES as URA08_DURATION, FPS as URA08_FPS } from "./ura08/script";
import { DURATION_IN_FRAMES as URA09_DURATION, FPS as URA09_FPS } from "./ura09/script";
import { DURATION_IN_FRAMES as URA10_DURATION, FPS as URA10_FPS } from "./ura10/script";
import { DURATION_IN_FRAMES as URA11_DURATION, FPS as URA11_FPS } from "./ura11/script";

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
      {/* ura-09「また聞きに行った」 9:16 short, on Gemini footage. */}
      <Composition
        id="Ura09MataKikiniItta"
        component={Ura09MataKikiniItta}
        durationInFrames={URA09_DURATION}
        fps={URA09_FPS}
        width={1080}
        height={1920}
      />
      {/* ura-10「一人で決めた夜」 9:16 short, on Gemini footage. */}
      <Composition
        id="Ura10HitoriDeKimetaYoru"
        component={Ura10HitoriDeKimetaYoru}
        durationInFrames={URA10_DURATION}
        fps={URA10_FPS}
        width={1080}
        height={1920}
      />
      {/* ura-11「聞き返された時」 9:16 short, on Gemini footage. */}
      <Composition
        id="Ura11KikikaesaretaToki"
        component={Ura11KikikaesaretaToki}
        durationInFrames={URA11_DURATION}
        fps={URA11_FPS}
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
