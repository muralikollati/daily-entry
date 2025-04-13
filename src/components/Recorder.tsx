import React, { useState } from "react";
import { PermissionsAndroid, Platform, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import AudioRecord from "react-native-audio-record";
import RNFS from "react-native-fs";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import RecoderConfirmationModal from "./RecrderConfomation";
import Toast from "react-native-toast-message";
import { requestAudioPermissions } from "../utils/helper";
import { useAuth } from "../contexts/AuthProvider";
import { transcribeAudio } from "../services/api";

type RecorderProps = {
  setPersonObj: (obj: any) => void;
  setLoading: (loading: boolean) => void;
};

const Recorder = ({ setPersonObj, setLoading }: RecorderProps) => {
  const [recording, setRecording] = useState(false);
  const [IsRecOpen, setIsRecOpen] = useState(false);
  const [audioPath, setAudioPath] = useState<string | null>(null);

  const { token } = useAuth();

  const startRecording = async () => {
    const granted = await requestAudioPermissions();
    if (!granted) {
      Toast.show({
        type: "error",
        text1: "Permission Denied",
        text2: "Please enable microphone and storage permissions.",
      });
      return
    };

    setIsRecOpen(false);
    // const path = `${RNFS.DocumentDirectoryPath}/audio_${Date.now()}.wav`;

    const options = {
      sampleRate: 16000,
      channels: 1,
      bitsPerSample: 16,
      wavFile: "recorded_audio.wav",
    };

    AudioRecord.init( options);
    AudioRecord.start();
    setRecording(true);
    // setAudioPath(path);
  };

  const stopRecording = async () => {
    if (!recording) return;
     const path = await AudioRecord.stop();
    setRecording(false);
    sendToTranscriptionAPI(path);
    // console.log("Audio file path:", audioPath);
  };

  const sendToTranscriptionAPI = async (uri: string | null) => {
    if (!uri) return;
    try {
    setLoading(true);
   const responce = await transcribeAudio(uri, token);
   const cleaned = responce?.output
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
   console.log("Transcription response:", JSON.parse(cleaned));
    const parsedObj = JSON.parse(cleaned);
    setPersonObj(
      (prev: any) => ({
        ...prev,
        name: parsedObj?.name,
        // item: parsedObj?.item,
        quantity: String(parsedObj?.quantity),
      })
    );
    setLoading(false);
    }
    catch (error) {
      setLoading(false);
      console.error("Error transcribing audio:", error);
      Toast.show({
        type: "error",
        text1: "Transcription Failed",
        text2: "Please try again.",
      });
    }
  };

  return (
    <View>
      <TouchableOpacity
        onPress={recording ? stopRecording : () => setIsRecOpen(true)}
        style={[
          styles.micButton,
          { backgroundColor: recording ? "#D32F2F" : "#6200EE" },
        ]}
      >
        <MaterialIcons name="keyboard-voice" size={30} color="#fff" />
        <Text style={styles.micText}>
          {recording ? "Recording..." : "Start Recording"}
        </Text>
      </TouchableOpacity>

      {IsRecOpen && (
        <RecoderConfirmationModal
          visible={IsRecOpen}
          onClose={() => setIsRecOpen(false)}
          onConfirm={startRecording}
        />
      )}
    </View>
  );
};

export default Recorder;

const styles = StyleSheet.create({
  micButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 10,
    justifyContent: "center",
    marginBottom: 20,
  },
  micText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "bold",
  },
});
