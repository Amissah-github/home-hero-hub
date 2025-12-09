import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Navbar } from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import {
  Home,
  Upload,
  Camera,
  ArrowRight,
  ArrowLeft,
  CheckCircle,
  User,
  Briefcase,
  FileText,
  Clock,
} from "lucide-react";
import { toast } from "sonner";

const serviceCategories = [
  { value: "cleaning", label: "Cleaning Services" },
  { value: "barber", label: "Barber & Styling" },
  { value: "cooking", label: "Personal Chef / Cooking" },
  { value: "laundry", label: "Laundry Services" },
  { value: "marketing", label: "Digital Marketing" },
];

const steps = [
  { id: 1, title: "Personal Info", icon: User },
  { id: 2, title: "Service Details", icon: Briefcase },
  { id: 3, title: "Verification", icon: FileText },
  { id: 4, title: "Availability", icon: Clock },
];

export default function ProviderOnboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Personal Info
    address: "",
    city: "",
    bio: "",
    // Service Details
    category: "",
    hourlyRate: "",
    yearsExperience: "",
    skills: "",
    // Verification
    idDocument: null as File | null,
    selfie: null as File | null,
    // Availability
    availableDays: [] as string[],
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileChange = (field: string, file: File | null) => {
    setFormData((prev) => ({ ...prev, [field]: file }));
  };

  const handleDayToggle = (day: string) => {
    setFormData((prev) => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter((d) => d !== day)
        : [...prev.availableDays, day],
    }));
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsLoading(false);
      toast.success("Application submitted successfully! We'll review your profile within 24-48 hours.");
      navigate("/provider/dashboard");
    }, 1500);
  };

  const progress = (currentStep / 4) * 100;

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-2xl">
          <div className="mb-8 text-center">
            <Link to="/" className="inline-flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg gradient-primary">
                <Home className="h-6 w-6 text-primary-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">HomeHelp</span>
            </Link>
          </div>

          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-4">
              {steps.map((step) => (
                <div
                  key={step.id}
                  className={`flex flex-col items-center gap-2 ${
                    step.id <= currentStep ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-full ${
                      step.id < currentStep
                        ? "bg-primary text-primary-foreground"
                        : step.id === currentStep
                        ? "border-2 border-primary text-primary"
                        : "border-2 border-muted text-muted-foreground"
                    }`}
                  >
                    {step.id < currentStep ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      <step.icon className="h-5 w-5" />
                    )}
                  </div>
                  <span className="text-xs font-medium hidden sm:block">{step.title}</span>
                </div>
              ))}
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card className="shadow-lg">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">
                {currentStep === 1 && "Personal Information"}
                {currentStep === 2 && "Service Details"}
                {currentStep === 3 && "Identity Verification"}
                {currentStep === 4 && "Set Your Availability"}
              </CardTitle>
              <CardDescription>
                {currentStep === 1 && "Tell us a bit about yourself"}
                {currentStep === 2 && "What service will you provide?"}
                {currentStep === 3 && "Upload your documents for verification"}
                {currentStep === 4 && "When are you available to work?"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Step 1: Personal Info */}
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Input
                      id="address"
                      placeholder="123 Main Street"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      placeholder="Lagos"
                      value={formData.city}
                      onChange={(e) => handleInputChange("city", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio / About You</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell customers about yourself, your experience, and why they should book you..."
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      rows={4}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Service Details */}
              {currentStep === 2 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="category">Service Category</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => handleInputChange("category", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a service category" />
                      </SelectTrigger>
                      <SelectContent>
                        {serviceCategories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hourlyRate">Hourly Rate (₦)</Label>
                    <Input
                      id="hourlyRate"
                      type="number"
                      placeholder="5000"
                      value={formData.hourlyRate}
                      onChange={(e) => handleInputChange("hourlyRate", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yearsExperience">Years of Experience</Label>
                    <Input
                      id="yearsExperience"
                      type="number"
                      placeholder="3"
                      value={formData.yearsExperience}
                      onChange={(e) => handleInputChange("yearsExperience", e.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="skills">Skills (comma separated)</Label>
                    <Input
                      id="skills"
                      placeholder="Deep cleaning, organization, laundry"
                      value={formData.skills}
                      onChange={(e) => handleInputChange("skills", e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 3: Verification */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Government-Issued ID</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Upload a clear photo of your valid ID (National ID, Driver's License, or Passport)
                    </p>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="idDocument"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileChange("idDocument", e.target.files?.[0] || null)}
                      />
                      <label htmlFor="idDocument" className="cursor-pointer">
                        {formData.idDocument ? (
                          <div className="flex items-center justify-center gap-2 text-success">
                            <CheckCircle className="h-5 w-5" />
                            <span>{formData.idDocument.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Upload className="h-8 w-8" />
                            <span>Click to upload ID document</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Selfie Photo</Label>
                    <p className="text-sm text-muted-foreground mb-2">
                      Take a clear selfie holding your ID next to your face
                    </p>
                    <div className="border-2 border-dashed border-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                      <input
                        type="file"
                        id="selfie"
                        accept="image/*"
                        capture="user"
                        className="hidden"
                        onChange={(e) => handleFileChange("selfie", e.target.files?.[0] || null)}
                      />
                      <label htmlFor="selfie" className="cursor-pointer">
                        {formData.selfie ? (
                          <div className="flex items-center justify-center gap-2 text-success">
                            <CheckCircle className="h-5 w-5" />
                            <span>{formData.selfie.name}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2 text-muted-foreground">
                            <Camera className="h-8 w-8" />
                            <span>Click to take or upload selfie</span>
                          </div>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Availability */}
              {currentStep === 4 && (
                <div className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Select the days you're available to work. You can adjust your schedule later.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                      <button
                        key={day}
                        type="button"
                        onClick={() => handleDayToggle(day)}
                        className={`p-4 rounded-lg border-2 transition-colors ${
                          formData.availableDays.includes(day)
                            ? "border-primary bg-primary/10 text-primary"
                            : "border-border hover:border-primary/50"
                        }`}
                      >
                        {day}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="mt-8 flex justify-between">
                {currentStep > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep} className="gap-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back
                  </Button>
                ) : (
                  <div />
                )}

                {currentStep < 4 ? (
                  <Button type="button" variant="hero" onClick={nextStep} className="gap-2">
                    Continue
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="hero"
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? "Submitting..." : "Submit Application"}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
