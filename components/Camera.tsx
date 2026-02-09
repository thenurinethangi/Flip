import { BarcodeScanningResult, CameraType, CameraView, useCameraPermissions } from "expo-camera"
import { StatusBar } from "expo-status-bar"
import { Check, RefreshCcw, X } from "lucide-react-native"
import React, { useRef, useState } from "react"
import { Alert, Image, Modal, Pressable, Text, View } from "react-native"

interface CameraModelProps {
  visible: boolean;
  uploadImage: (url: string) => void;
  removeImage: () => void
  onClose: () => void
}

const CameraModel = ({ visible, uploadImage, removeImage, onClose }: CameraModelProps) => {

  const [permissions, requestPermissions] = useCameraPermissions();
  // Media library permissions are not required unless saving to library.

  const [facing, setFacing] = useState<CameraType>("back")
  const [photo, setPhoto] = useState<string | null>(null)

  const cameraRef = useRef<CameraView>(null);

  // Note: no MediaLibrary permission request since we don't save to the library.

  const takePhoto = async () => {
    if (!cameraRef.current) {
      return
    }
    const result = await cameraRef.current.takePictureAsync();
    // await MediaLibrary.saveToLibraryAsync(result.uri);
    setPhoto(result.uri);

    // Alert.alert("Saved");
  }

  if (!visible) {
    return null;
  }

  if (!permissions?.granted) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Camera permission is required</Text>
        <Text onPress={requestPermissions}>Grant permission</Text>
      </View>
    )
  }

  // if (!mediaPermission?.granted) {
  //   return (
  //     <View className="flex-1 items-center justify-center">
  //       <Text>Media permission is required</Text>
  //       <Text onPress={requestMediaPermission} className="text-xl p-2">Grant permission</Text>
  //     </View>
  //   )
  // }

  return (
    <Modal
      animationType="slide"
      statusBarTranslucent
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black">
        <StatusBar style="light" translucent backgroundColor="transparent" />
        <CameraView
          ref={cameraRef}
          style={{ flex: 1 }}
          facing={facing}
          barcodeScannerSettings={{
            barcodeTypes: ["qr"]
          }}
          onBarcodeScanned={(result: BarcodeScanningResult) => {
            console.log(result.data)
            Alert.alert(result.data)
          }}
        />

        {photo && (
          <Image
            source={{ uri: photo }}
            className="absolute inset-0"
            resizeMode="cover"
          />
        )}

        <View className="absolute top-0 left-0 right-0 pt-12 px-6 flex-row items-center justify-between">
          <Pressable
            className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
            onPress={() => {
              onClose();
              setPhoto(null);
              removeImage();
            }}
          >
            <X size={18} color="#fff" />
          </Pressable>
          {!photo && (
            <Pressable
              className="w-10 h-10 rounded-full bg-black/50 items-center justify-center"
              onPress={() => setFacing(facing === "back" ? "front" : "back")}
            >
              <RefreshCcw size={18} color="#fff" />
            </Pressable>
          )}
        </View>

        <View className="absolute bottom-0 left-0 right-0 pb-10 pt-6 px-10">
          {!photo ? (
            <View className="items-center">
              <Pressable
                onPress={takePhoto}
                className="w-20 h-20 rounded-full border-4 border-white items-center justify-center"
              >
                <View className="w-16 h-16 rounded-full bg-white" />
              </Pressable>
            </View>
          ) : (
            <View className="flex-row items-center justify-between">
              <Pressable
                className="w-14 h-14 rounded-full bg-black/60 items-center justify-center"
                onPress={() => {
                  setPhoto(null);
                  removeImage();
                  onClose();
                }}
              >
                <X size={22} color="#fff" />
              </Pressable>
              <Pressable
                className="w-14 h-14 rounded-full bg-emerald-500 items-center justify-center"
                onPress={() => {
                  uploadImage(photo);
                  setPhoto(null);
                  onClose();
                }}
              >
                <Check size={22} color="#fff" />
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}

export default CameraModel
