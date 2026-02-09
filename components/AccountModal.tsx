import { AppIcon } from "@/components/ui/icon-symbol";
import { ThemeContext } from "@/context/themeContext";
import { auth } from "@/services/firebase";
import { createUser, deleteUserProfile, subscribeUser, updateUser, UserProfile } from "@/services/userService";
import * as DocumentPicker from "expo-document-picker";
import { deleteUser, onAuthStateChanged, signOut } from "firebase/auth";
import { ArrowLeft } from "lucide-react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { Alert, BackHandler, Image, Modal, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NicknameModal from "./NicknameModal";

interface AccountModalProps {
  visible: boolean;
  onClose: () => void;
}

type User = {
  uid: string;
  email: string;
};

type UserData = UserProfile;

type Avatar = {
  url: string;
  isLoading: boolean;
};

const AccountModal: React.FC<AccountModalProps> = ({ visible, onClose }) => {
  const { currentTheme } = useContext(ThemeContext);
  const isDark = currentTheme === "dark";
  const cardBg = isDark ? "#1B1B1B" : "#FFFFFF";
  const textPrimary = isDark ? "#E5E7EB" : "#111827";
  const textSecondary = isDark ? "#9CA3AF" : "#9CA3AF";
  const divider = isDark ? "#1F2937" : "#EEF0F5";
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData>({
    id: '',
    userId: '',
    avatar: '',
    name: '',
    email: ''
  });
  const [avatar, setAvatar] = useState<Avatar | null>(null);
  const [showNicknameModal, setShowNicknameModal] = useState(false);


  const handleSaveAndClose = useCallback(async () => {
    if (userData?.id && userData?.id !== '') {
      try {
        await updateUser(userData);
      }
      catch (error) {
        console.log("Failed to save user profile", error);
      }
    }
    else {
      try {
        const id = await createUser(userData);
      }
      catch (e) {
        console.log(e);
      }
    }
    onClose();
  }, [avatar?.url, onClose, userData]);

  useEffect(() => {
    let userUnsub: (() => void) | null = null;
    const authUnsub = onAuthStateChanged(auth, (u) => {
      if (u) {
        setUser(u as User);
        if (userUnsub) userUnsub();
        userUnsub = subscribeUser(
          u.uid,
          (profile) => {
            if (profile) {
              setUserData(profile);
              setAvatar({ url: profile.avatar ?? "", isLoading: false });
            } else {
              setUserData({
                id: "",
                userId: u.uid,
                avatar: "",
                name: (u.email ?? "").split("@")[0],
                email: u.email ?? "",
              });
            }
          },
          (error) => console.log(error),
        );
      }
    });
    return () => {
      if (userUnsub) userUnsub();
      authUnsub();
    };
  }, []);

  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => {
      void handleSaveAndClose();
      return true;
    });
    return () => sub.remove();
  }, [handleSaveAndClose, visible]);

  const pickFile = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "image/*",
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];
      console.log("File:", file);
      setAvatar({ url: file.uri, isLoading: true });

      uploadToCloudinary(file.uri, file.mimeType || "", file.name)
        .then((secure_url) => {
          setAvatar({ url: secure_url, isLoading: false });
          setUserData((prev) => (prev ? { ...prev, avatar: secure_url } : ({ avatar: secure_url } as UserData)));
        })
        .catch((err) => {
          console.log("Upload error:", err);
          setAvatar({ url: "", isLoading: false });
        });
    } catch (err) {
      console.log("File pick error:", err);
    }
  };

  const uploadToCloudinary = async (
    fileUri: string,
    fileType: string,
    fileName: string,
  ) => {
    const data: FormData = new FormData();
    data.append("file", {
      uri: fileUri,
      type: fileType,
      name: fileName,
    } as any);
    data.append("upload_preset", "task_uploads");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dbhdjxmh9/auto/upload",
      {
        method: "POST",
        body: data,
      },
    );

    return (await res.json()).secure_url;
  };

  function handleDeleteAccount() {
    Alert.alert(
      "Delete account?",
      "This will permanently delete your account and profile data.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              if (userData?.id) {
                await deleteUserProfile(userData.id);
              }
              if (auth.currentUser) {
                await deleteUser(auth.currentUser);
              }
              await signOut(auth);
              onClose();
            } catch (error) {
              console.log("Delete account failed", error);
            }
          },
        },
      ],
    );
  }

  return (
    <>
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        statusBarTranslucent
        onRequestClose={handleSaveAndClose}
      >
        <SafeAreaView className={`flex-1 ${isDark ? "bg-[#0B0F0E]" : "bg-[#F5F6F8]"}`}>
          <View className="px-4 pt-4 flex-row items-center gap-x-4">
            <TouchableOpacity onPress={handleSaveAndClose}>
              <ArrowLeft size={22} color={isDark ? "#E5E7EB" : "#222"} strokeWidth={2} />
            </TouchableOpacity>
            <Text className="text-[18px] font-semibold" style={{ color: textPrimary }}>
              Account
            </Text>
          </View>

          <View className="mt-6 px-4">
            <View className="rounded-[18px] overflow-hidden" style={{ backgroundColor: cardBg }}>
              <TouchableOpacity
                onPress={pickFile}
                className="px-4 py-4 flex-row items-center justify-between"
              >
                <Text className="text-[15px]" style={{ color: textPrimary }}>Avatar</Text>
                {avatar === null || avatar.url === "" ? (
                  <View className="w-[36px] h-[36px] rounded-full bg-[#4F6EF7]" />
                ) : (
                  <Image
                    source={{ uri: avatar.url }}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      opacity: avatar.isLoading ? 0.5 : 1,
                    }}
                  />
                )}
              </TouchableOpacity>
              <View className="h-[1px]" style={{ backgroundColor: divider }} />
              <TouchableOpacity
                className="px-4 py-4 flex-row items-center justify-between"
                onPress={() => setShowNicknameModal(true)}
              >
                <Text className="text-[15px]" style={{ color: textPrimary }}>Nickname</Text>
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-[14px]" style={{ color: textSecondary }}>
                    {userData?.name}
                  </Text>
                  <AppIcon name="chevronRight" color={isDark ? "#6B7280" : "#C5C9D3"} size={18} />
                </View>
              </TouchableOpacity>
              <View className="h-[1px]" style={{ backgroundColor: divider }} />
              <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
                <Text className="text-[15px]" style={{ color: textPrimary }}>Email</Text>
                <View className="flex-row items-center gap-x-2">
                  <Text className="text-[14px]" style={{ color: textSecondary }}>
                    {user?.email}
                  </Text>
                  <AppIcon name="chevronRight" color={isDark ? "#6B7280" : "#C5C9D3"} size={18} />
                </View>
              </TouchableOpacity>
              {/* <View className="h-[1px] bg-[#EEF0F5]" />
            <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">2-Step Verification</Text>
              <AppIcon name="chevronRight" color="#C5C9D3" size={18} />
            </TouchableOpacity>
            <View className="h-[1px] bg-[#EEF0F5]" />
            <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">Device Management</Text>
              <AppIcon name="chevronRight" color="#C5C9D3" size={18} />
            </TouchableOpacity> */}
            </View>

            {/* <View className="bg-white rounded-[18px] overflow-hidden mt-4">
            <TouchableOpacity className="px-4 py-4 flex-row items-center justify-between">
              <Text className="text-[15px] text-[#111827]">Google</Text>
              <View className="flex-row items-center gap-x-2">
                <Text className="text-[14px] text-[#9CA3AF]">Thenuri Nathangi</Text>
                <AppIcon name="chevronRight" color="#C5C9D3" size={18} />
              </View>
            </TouchableOpacity>
          </View> */}
          </View>

          <View className="mt-auto px-4 pb-6">
            <TouchableOpacity onPress={handleDeleteAccount} className="border border-red-700 rounded-[14px] py-3 items-center">
              <Text className="text-red-700 text-[15px] font-semibold">
                Delete Account
              </Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      <NicknameModal
        visible={showNicknameModal}
        initialValue={userData?.name ?? ""}
        onClose={() => setShowNicknameModal(false)}
        onSave={(name) => {
          setUserData((prev) => (prev ? { ...prev, name } : ({ name } as UserData)));
          setShowNicknameModal(false);
        }}
      />

    </>
  );
};

export default AccountModal;
