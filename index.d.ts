declare module "camerapackagesanju" {
  interface CameraApp {
    showFlipButton(value: boolean): CameraApp;
    shouldAllowCrop(value: boolean): CameraApp;
    useFrontCamera(value: boolean): CameraApp;
    setWidth(value: number): CameraApp;
    enableZoom(value: boolean): CameraApp;
    setMinSize(value: number): CameraApp;
    enableTouch(value: boolean): CameraApp;
    enableRotation(value: boolean): CameraApp;
    setCropType(value: string): CameraApp;
    setBarderColor(value: string): CameraApp;
    allowDoubleTapZoom(value: boolean): CameraApp;
    setBarderwidth(value: number): CameraApp;
    initialize(): Promise<void>;
  }

  const webkitCamera: () => CameraApp;
  export default webkitCamera;
}
