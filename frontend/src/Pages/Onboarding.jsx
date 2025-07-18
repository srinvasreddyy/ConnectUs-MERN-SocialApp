import React from 'react'
import { useState } from 'react';
import useAuthUser from '../hooks/useAuthUser.js';
import toast from 'react-hot-toast';
import { LoaderIcon, MapPinIcon, MessageCircleHeartIcon, ShuffleIcon, CameraIcon} from "lucide-react";
import useOnboarding from '../hooks/useOnboarding.js';
const Onboarding = () => {
    const {  user } = useAuthUser();
    const [formState, setFormState] = useState({
      fullname: user?.fullname || "",
      bio: user?.bio || "",
      location: "",
    profilePic: user?.profilePic || "",
  });


  
  // const queryClient = useQueryClient();
  // const { mutate , isPending , error } = useMutation({
  //   mutationKey: ["onboardUser"],
  //   mutationFn: async (formState) => {
  //     const res = await axiosInstance.post("auth/onboarding", formState);
  //     console.log(res.data);
  //     return res.data;
  //   },
  //   onSuccess: () => {
  //     toast.success("Onboarding successful");
  //     queryClient.invalidateQueries(["authUser"]);
  //     setForm({
  //       fullname: "",
  //       bio: "",
  //       location: "",
  //       profilePic: "",
  //     });
  //   },
  //   onError: (error) => {
  //     console.log(error.response.data.message)
  //     toast.error(error.response.data.message);
  //   },
  // })

  const  { onboardMutation , isPending , error } = useOnboarding()
  function handleSubmit(e) {
    e.preventDefault();
    onboardMutation(formState);
  }

  const handleRandomAvatar = () => {
    const idx = Math.floor(Math.random() * 100) + 1; // 1-100 included
    const randomAvatar = `https://avatar.iran.liara.run/public/${idx}.png`;
    setFormState({ ...formState, profilePic: randomAvatar });
    toast.success("Random profile picture generated!");
  };



  return (
     <div className="min-h-screen rounded bg-base-100 flex items-center justify-center p-4">
      <div className="card bg-base-200 w-full max-w-7xl rounded shadow-xl flex flex-row">
        <div className="hidden lg:flex w-full lg:w-1/2 bg-primary/10 items-center justify-center">
          <div className="max-w-md p-8">
            {/* Illustration */}
            <div className="relative aspect-square max-w-sm mx-auto">
              <img src="/onboarding.png" alt="Language connection illustration" className="w-full h-full" />
            </div>

            <div className="text-center space-y-3 mt-6">
              <h2 className="text-xl font-semibold">Connect partners anywhere!</h2>
              <p className="opacity-70">
                Build conversations, make friends, and improve your networking skills together
              </p>
            </div>
          </div>
        </div>
        <div className="card-body p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6">Complete Your Profile</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PROFILE PIC CONTAINER */}
            <div className="flex flex-col items-center justify-center space-y-4">
              {/* IMAGE PREVIEW */}
              <div className="size-32 rounded-full bg-base-300 overflow-hidden">
                {formState.profilePic ? (
                  <img
                    src={formState.profilePic}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <CameraIcon className="size-12 text-base-content opacity-40" />
                  </div>
                )}
              </div>

              {/* Generate Random Avatar BTN */}
              <div className="flex items-center gap-2">
                <button type="button" onClick={handleRandomAvatar} className="btn btn-accent">
                  <ShuffleIcon className="size-4 mr-2" />
                  Generate Random Avatar
                </button>
              </div>
            </div>

            {/* FULL NAME */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Full Name</span>
              </label>
              <input
                type="text"
                name="fullname"
                value={formState.fullname}
                onChange={(e) => setFormState({ ...formState, fullname: e.target.value })}
                className="input input-bordered w-full"
                placeholder="Your full name"
              />
            </div>

            {/* BIO */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Bio</span>
              </label>
              <textarea
                name="bio"
                value={formState.bio}
                onChange={(e) => setFormState({ ...formState, bio: e.target.value })}
                className="textarea textarea-bordered h-24"
                placeholder="Tell others about yourself "
              />
            </div>

            {/* LOCATION */}
            <div className="form-control">
  <label className="label">
    <span className="label-text">Location</span>
  </label>
  <div className="relative">
    <MapPinIcon className="absolute top-1/2 transform -translate-y-1/2 left-3 size-5 text-base-content opacity-70" />
    <select
      name="location"
      value={formState.location}
      placeholder="Search your city by typing..."
      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
      className="input input-bordered w-full pl-10 appearance-none"
      style={{ height: "2.5rem" }} // Optional: to match input height
    >
      <option value="">Search your city by typing...</option>
      <option value="Mumbai">Mumbai</option>
      <option value="Delhi">Delhi</option>
      <option value="Guntur">Guntur</option>
      <option value="Vijayawada">Vijayawada</option>
      <option value="Bangalore">Bangalore</option>
      <option value="Hyderabad">Hyderabad</option>
      <option value="Chennai">Chennai</option>
      <option value="Kolkata">Kolkata</option>
      <option value="Pune">Pune</option>
      <option value="Ahmedabad">Ahmedabad</option>
      <option value="Jaipur">Jaipur</option>
      <option value="Lucknow">Lucknow</option>
      <option value="Surat">Surat</option>
      <option value="Kanpur">Kanpur</option>
      <option value="Nagpur">Nagpur</option>
      <option value="Indore">Indore</option>
      <option value="Bhopal">Bhopal</option>
      <option value="Patna">Patna</option>
      <option value="Ludhiana">Ludhiana</option>
      <option value="Agra">Agra</option>
      <option value="Nashik">Nashik</option>
      <option value="Vadodara">Vadodara</option>
      {/* Add more cities as needed */}
    </select>
  </div>
</div>

            {/* SUBMIT BUTTON */}

            <button className="btn btn-primary w-full" type="submit">
              {!isPending ? (
                <>
                  <MessageCircleHeartIcon className="size-5 mr-2" />
                  Complete Onboarding
                </>
              ) : (
                <>
                  <LoaderIcon className="animate-spin size-5 mr-2" />
                  Onboarding...
                </>
              )}
            </button>
          </form>
        </div>
        
      </div>
      
    </div>
  )
}

export default Onboarding