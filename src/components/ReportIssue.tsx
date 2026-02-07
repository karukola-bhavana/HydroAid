import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertTriangle,
  Camera,
  CheckCircle,
  Loader2,
  MapPin,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useAuth } from "@/context/AuthContext";

// Debug Firebase connection on component mount
console.log("🔍 Firebase DB instance:", db);
console.log("🔍 Firebase project ID:", db.app.options.projectId);

const issueTypes = [
  "No clean water access",
  "Broken pipelines",
  "Contaminated water",
  "Drought conditions",
  "Flooding affecting supply",
  "Other",
];

const ReportIssueForm = () => {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedReportId, setSubmittedReportId] = useState("");
  const [error, setError] = useState("");
  const [fileName, setFileName] = useState("");
  const [name, setName] = useState(user?.name || "");
  const [contact, setContact] = useState(user?.email || "");
  const [issueType, setIssueType] = useState<string | undefined>(undefined);
  const [country, setCountry] = useState("");
  const [stateProvince, setStateProvince] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
      },
      () => setError("Unable to fetch location"),
      { enableHighAccuracy: true }
    );
  };

  const testFirebaseConnection = async () => {
    try {
      console.log("Testing Firebase connection...");
      const testDoc = await addDoc(collection(db, "test"), {
        test: true,
        timestamp: new Date().toISOString(),
        project: "hydro-aid"
      });
      console.log("✅ Firebase connection successful! Test doc ID:", testDoc.id);
      setError(""); // Clear any previous errors
      alert("✅ Firebase connection successful! You can now submit reports.");
    } catch (err: any) {
      console.error("❌ Firebase connection failed:", err);
      setError(`Firebase connection failed: ${err.message}`);
      alert(`❌ Firebase connection failed: ${err.message}`);
    }
  };

  const testWaterReportSubmission = async () => {
    try {
      console.log("🧪 Testing water report submission...");
      
      const testReport = {
        name: "Test User",
        contact: "test@example.com",
        issueType: "Test Issue",
        country: "Test Country",
        stateProvince: "Test State",
        description: "This is a test report",
        latitude: 0,
        longitude: 0,
        fileName: "",
        status: "reported",
        priority: "medium",
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
      };
      
      console.log("Test report data:", testReport);
      
      const docRef = await addDoc(collection(db, "waterReports"), testReport);
      console.log("✅ Test water report saved with ID:", docRef.id);
      
      alert("✅ Test water report submitted successfully! Check admin dashboard.");
    } catch (err: any) {
      console.error("❌ Test water report failed:", err);
      alert(`❌ Test water report failed: ${err.message}`);
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    console.log("🚀 Form submission started");
    console.log("Form data:", {
      name, contact, issueType, country, stateProvince, description, lat, lng, isConfirmed
    });

    try {
      // Basic validation
      if (!issueType) throw new Error("Please select an issue type");
      if (!contact.trim()) throw new Error("Please provide contact information");
      if (!country.trim()) throw new Error("Please provide country");
      if (!stateProvince.trim()) throw new Error("Please provide state/province");
      if (!description.trim()) throw new Error("Please provide description");
      if (lat == null || lng == null)
        throw new Error("Please provide location (use current location)");

      if (!isConfirmed) {
        throw new Error("Please confirm the information is accurate");
      }

      console.log("✅ All validations passed");

      // Prepare simple data structure
      const reportData = {
        name: name.trim() || "Anonymous",
        contact: contact.trim(),
        issueType,
        country: country.trim(),
        stateProvince: stateProvince.trim(),
        description: description.trim(),
        latitude: lat,
        longitude: lng,
        fileName: fileName || "",
        status: "reported",
        priority: "medium",
        createdAt: new Date().toISOString(),
        timestamp: Date.now(),
      };

      console.log("📝 Report data prepared:", reportData);

      // Save to Firestore database
      console.log("🔥 Attempting to save report to Firestore...");
      console.log("📊 Report data:", reportData);
      console.log("🔗 Firebase DB instance:", db);
      console.log("🏗️ Firebase project:", db.app.options.projectId);
      
      const docRef = await addDoc(collection(db, "waterReports"), reportData);
      console.log("✅ SUCCESS! Report saved with ID:", docRef.id);
      console.log("✅ Document reference:", docRef);
      console.log("✅ Report successfully submitted to Firebase!");

      setSubmittedReportId(docRef.id);
      setIsSubmitted(true);
    } catch (err: any) {
      console.error("❌ SUBMISSION FAILED:", err);
      console.error("Error type:", typeof err);
      console.error("Error message:", err.message);
      console.error("Error code:", err.code);
      console.error("Full error:", err);
      
      // Try to save locally as fallback
      try {
        console.log("🔄 Attempting local storage fallback...");
        const localReports = JSON.parse(localStorage.getItem('waterReports') || '[]');
        const localReport = {
          id: 'local_' + Date.now(),
          name: name.trim() || "Anonymous",
          contact: contact.trim(),
          issueType,
          country: country.trim(),
          stateProvince: stateProvince.trim(),
          description: description.trim(),
          latitude: lat,
          longitude: lng,
          fileName: fileName || "",
          status: "reported",
          priority: "medium",
          createdAt: new Date().toISOString(),
          timestamp: Date.now(),
          submittedAt: new Date().toISOString(),
          isLocal: true
        };
        localReports.push(localReport);
        localStorage.setItem('waterReports', JSON.stringify(localReports));
        
        console.log("💾 Report saved locally as fallback");
        setSubmittedReportId(localReport.id);
        setIsSubmitted(true);
        return; // Exit early since we saved locally
      } catch (localErr) {
        console.error("❌ Local storage also failed:", localErr);
      }
      
      // Show user-friendly error
      let errorMessage = "Failed to submit report. Please try again.";
      
      if (err.message) {
        errorMessage = err.message;
      } else if (err.code) {
        errorMessage = `Error: ${err.code}`;
      }
      
      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="text-center py-8 sm:py-12 bg-white rounded-2xl shadow-md">
        <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
        <h3 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
          Report Submitted Successfully!
        </h3>
        <p className="text-gray-600 mb-2">
          Thank you for helping improve water safety.
        </p>
        {submittedReportId && (
          <p className="text-sm text-blue-600 mb-4 font-mono">
            Report ID: {submittedReportId}
          </p>
        )}
        <Button onClick={() => {
          setIsSubmitted(false);
          setSubmittedReportId("");
          // Reset all form fields
          setName(user?.name || "");
          setContact(user?.email || "");
          setIssueType(undefined);
          setCountry("");
          setStateProvince("");
          setDescription("");
          setLat(null);
          setLng(null);
          setFileName("");
          setIsConfirmed(false);
          setError("");
        }}>
          Submit Another Report
        </Button>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 sm:space-y-8 bg-white p-4 sm:p-6 lg:p-8 rounded-2xl shadow-lg w-full"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Contact + Issue Type */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="w-full">
          <p className="text-sm font-semibold text-gray-900 mb-2">
            Contact Details
          </p>
          <Input
            placeholder="Your Name (Optional)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mb-3"
          />
          <Input
            placeholder="Email or Phone"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            required
          />
        </div>

        <div className="w-full">
          <p className="text-sm font-semibold text-gray-900 mb-2">Issue Type</p>
          <Select onValueChange={(v) => setIssueType(v)} required>
            <SelectTrigger>
              <SelectValue placeholder="Select an issue type" />
            </SelectTrigger>
            <SelectContent className="z-[9999] bg-white shadow-xl rounded-lg max-h-64 overflow-auto">
              {issueTypes.map((t) => (
                <SelectItem
                  key={t}
                  value={t}
                  className="hover:bg-blue-50 focus:bg-blue-100 cursor-pointer text-gray-800"
                >
                  {t}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Country + State */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Input
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
        <Input
          placeholder="State / Province"
          value={stateProvince}
          onChange={(e) => setStateProvince(e.target.value)}
          required
        />
      </div>

      {/* Description */}
      <Textarea
        placeholder="Describe what happened, when it started, and any impacts..."
        rows={5}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />

      {/* Location */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg text-sm">
          <MapPin className="h-4 w-4 text-blue-600" />
          {lat && lng ? (
            <span>
              {lat.toFixed(4)}, {lng.toFixed(4)}
            </span>
          ) : (
            <span className="text-gray-600">Location not set</span>
          )}
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={handleUseCurrentLocation}
          className="w-full sm:w-auto"
        >
          Use Current Location
        </Button>
      </div>

      {/* File Upload */}
      <div className="bg-gray-50 rounded-xl py-6 text-center">
        <input
          type="file"
          id="media-upload"
          className="hidden"
          onChange={(e) => {
            if (e.target.files && e.target.files[0]) {
              setFileName(e.target.files[0].name);
            }
          }}
        />
        <label
          htmlFor="media-upload"
          className="cursor-pointer inline-flex items-center gap-2 text-blue-700 font-medium"
        >
          <Camera className="h-5 w-5" />
          Click to upload photo/video
        </label>
        {fileName && (
          <p className="text-sm text-gray-600 mt-2">Selected: {fileName}</p>
        )}
      </div>

      {/* Confirmation */}
      <div className="flex items-start gap-3 bg-blue-50 rounded-lg p-3">
        <input
          type="checkbox"
          id="confirm"
          checked={isConfirmed}
          onChange={(e) => setIsConfirmed(e.target.checked)}
          className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label htmlFor="confirm" className="text-sm text-gray-800">
          I confirm the information provided is accurate.
        </label>
      </div>

      {/* Debug Section - Temporary */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <p className="text-sm text-yellow-800 mb-2">
          <strong>Debug:</strong> If reports are not submitting, test these:
        </p>
        <div className="flex gap-2 flex-wrap">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={testFirebaseConnection}
            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 border-yellow-300"
          >
            Test Firebase Connection
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={testWaterReportSubmission}
            className="bg-blue-100 hover:bg-blue-200 text-blue-800 border-blue-300"
          >
            Test Water Report
          </Button>
        </div>
      </div>


      {/* Error */}
      {error && (
        <p className="text-sm text-red-600 flex items-center gap-1">
          <AlertTriangle className="h-4 w-4" /> {error}
        </p>
      )}

      {/* Submit */}
      <Button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white h-11 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            Submitting Report...
          </>
        ) : (
          "Submit Report"
        )}
      </Button>

    </motion.form>
  );
};

export const ReportIssueModal = () => (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-white/40 w-full sm:w-auto">
        <AlertTriangle className="mr-2 h-5 w-5" /> Report a Water Issue
      </Button>
    </DialogTrigger>
    <DialogContent className="max-w-4xl w-full mx-4 sm:mx-0 border-0 shadow-none bg-transparent p-0 outline-none focus-visible:outline-none">
      <DialogHeader>
        <DialogTitle className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-4">
          Report Water Issue
        </DialogTitle>
      </DialogHeader>
      <ReportIssueForm />
    </DialogContent>
  </Dialog>
);

export default ReportIssueForm;