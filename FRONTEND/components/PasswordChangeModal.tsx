import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import TextInputWithIcon from "./TextInputWithIconProps";
import ColoredButton from "./ColoredButton";
import { useAuthStore } from "@/hooks/useAuthStore";

interface PasswordChangeModalProps {
  visible: boolean;
  onClose: () => void;
}

type Step = "current" | "new" | "success";

const PasswordChangeModal: React.FC<PasswordChangeModalProps> = ({
  visible,
  onClose,
}) => {
  const [step, setStep] = useState<Step>("current");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");

  const { changePassword, isLoading, clearError } = useAuthStore();

  const handleVerifyCurrentPassword = async () => {
    if (!currentPassword.trim()) {
      setError("Please enter your current password");
      return;
    }

    try {
      clearError();
      // TODO: Implement current password verification
      // For now, we'll simulate a successful verification
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setStep("new");
      setError("");
    } catch (err: any) {
      setError("Incorrect password!");
    }
  };

  const handleCreateNewPassword = async () => {
    // Validation
    if (!newPassword.trim() || !confirmPassword.trim()) {
      setError("Please fill in all password fields");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
    if (!passwordRegex.test(newPassword)) {
      setError("Password must contain uppercase, number, and symbol");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      clearError();
      await changePassword(currentPassword, newPassword);
      setStep("success");
      setError("");
    } catch (err: any) {
      setError(err.message || "Failed to change password");
    }
  };

  const handleClose = () => {
    setStep("current");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setError("");
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    onClose();
  };

  const renderCurrentPasswordStep = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="w-16 h-16 bg-yellow-100 rounded-full items-center justify-center mb-4">
        <MaterialIcons name="lock" size={32} color="#F96C00" />
      </View>
      <Text className="text-Heading4 font-Manrope font-bold text-neutral-90 mb-6 text-center">
        Enter Your Current Password
      </Text>

      <TextInputWithIcon
        label="Password"
        value={currentPassword}
        onChangeText={setCurrentPassword}
        placeholder="userpassword"
        leftIcon={
          <MaterialIcons name="lock-outline" size={22} color="#E95B0C" />
        }
        rightIcon={
          <TouchableOpacity
            onPress={() => setShowCurrentPassword(!showCurrentPassword)}
          >
            <Ionicons
              name={showCurrentPassword ? "eye" : "eye-off"}
              size={20}
              color="#9E9E9E"
            />
          </TouchableOpacity>
        }
        inputProps={{ secureTextEntry: !showCurrentPassword }}
        showValidationError={!!error}
        required
      />

      {error && (
        <Text className="text-red-500 text-sm font-Manrope mt-2">{error}</Text>
      )}

      <View className="w-full mt-6">
        <ColoredButton
          text={isLoading ? "Verifying..." : "Submit"}
          btnClassName="w-full py-3"
          onPress={handleVerifyCurrentPassword}
          disabled={isLoading}
          icon={isLoading ? <ActivityIndicator color="#fff" /> : undefined}
        />
      </View>
    </View>
  );

  const renderNewPasswordStep = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="w-16 h-16 bg-yellow-100 rounded-full items-center justify-center mb-4">
        <MaterialIcons name="lock" size={32} color="#F96C00" />
      </View>
      <Text className="text-Heading4 font-Manrope font-bold text-neutral-90 mb-2 text-center">
        Create New Password
      </Text>
      <Text className="text-BodySmallRegular font-Manrope text-neutral-60 mb-6 text-center">
        Password must include a capital letter, a number, and a symbol.
      </Text>

      <TextInputWithIcon
        label="Password"
        value={newPassword}
        onChangeText={setNewPassword}
        placeholder="userpassword"
        leftIcon={
          <MaterialIcons name="lock-outline" size={22} color="#E95B0C" />
        }
        rightIcon={
          <TouchableOpacity
            onPress={() => setShowNewPassword(!showNewPassword)}
          >
            <Ionicons
              name={showNewPassword ? "eye" : "eye-off"}
              size={20}
              color="#9E9E9E"
            />
          </TouchableOpacity>
        }
        inputProps={{ secureTextEntry: !showNewPassword }}
        showValidationError={!!error}
        required
      />

      <TextInputWithIcon
        label="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        placeholder="userpassword"
        leftIcon={
          <MaterialIcons name="lock-outline" size={22} color="#E95B0C" />
        }
        rightIcon={
          <TouchableOpacity
            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            <Ionicons
              name={showConfirmPassword ? "eye" : "eye-off"}
              size={20}
              color="#9E9E9E"
            />
          </TouchableOpacity>
        }
        inputProps={{ secureTextEntry: !showConfirmPassword }}
        showValidationError={!!error}
        required
      />

      {error && (
        <Text className="text-red-500 text-sm font-Manrope mt-2">{error}</Text>
      )}

      <View className="w-full mt-6">
        <ColoredButton
          text={isLoading ? "Creating..." : "Submit"}
          btnClassName="w-full py-3"
          onPress={handleCreateNewPassword}
          disabled={isLoading}
          icon={isLoading ? <ActivityIndicator color="#fff" /> : undefined}
        />
      </View>
    </View>
  );

  const renderSuccessStep = () => (
    <View className="flex-1 justify-center items-center px-6">
      <View className="w-16 h-16 bg-green-100 rounded-full items-center justify-center mb-4">
        <Ionicons name="checkmark" size={32} color="#22C55E" />
      </View>
      <Text className="text-Heading4 font-Manrope font-bold text-neutral-90 mb-6 text-center">
        New Password successfully created
      </Text>

      <View className="w-full mt-6">
        <ColoredButton
          text="Done"
          btnClassName="w-full py-3"
          onPress={handleClose}
        />
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={handleClose}
    >
      <View className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 border-b border-neutral-30">
          <View style={{ width: 24 }} />
          <Text className="text-Heading4 font-Manrope font-bold text-secondary">
            Set password page
          </Text>
          <TouchableOpacity onPress={handleClose}>
            <Ionicons name="close" size={24} color="#222" />
          </TouchableOpacity>
        </View>

        {/* Content */}
        {step === "current" && renderCurrentPasswordStep()}
        {step === "new" && renderNewPasswordStep()}
        {step === "success" && renderSuccessStep()}
      </View>
    </Modal>
  );
};

export default PasswordChangeModal;
