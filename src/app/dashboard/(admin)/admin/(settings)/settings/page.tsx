"use client";

import axios from "axios";
import { useSession } from "next-auth/react";
import { ChangeEvent, useEffect, useState } from "react";

import { getApiUrl } from "~/actions/getApiUrl";
import CustomButton from "~/components/common/common-button/common-button";
import CustomInput from "~/components/common/input/input";
import { Textarea } from "~/components/common/text-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { InstagramIcon, LinkedinIcon, XIcon } from "./icons";

const pronouns = [
  { value: "He/Him", label: "He/Him" },
  { value: "She/Her", label: "She/Her" },
  { value: "Other", label: "Other" },
];

const SettingsPage = () => {
  const { data } = useSession();

  const [isPending, setIsPending] = useState(false);

  const [pronoun, setPronoun] = useState("");

  const [socialLinks, setSocialLinks] = useState({
    x: "",
    instagram: "",
    linkedin: "",
  });

  const linksDataHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  const [formData, setFormData] = useState({
    username: "",
    jobTitle: "",
    department: "",
    email: "",
    bio: "",
  });

  const formDataHandler = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
  };

  useEffect(() => {
    (async () => {
      const baseUrl = await getApiUrl();
      const API_URL = `${baseUrl}/api/v1/profile/${data?.user.id}`;

      try {
        const response = await axios.get(API_URL, {
          headers: {
            Authorization: `Bearer ${data?.access_token}`,
          },
        });
        setPronoun(response.data.data.pronouns);
        setSocialLinks({
          x: response.data.data.social_links[0],
          instagram: response.data.data.scoial_links[1],
          linkedin: response.data.data.social_links[2],
        });
        setFormData({
          bio: response.data.data.bio,
          jobTitle: response.data.data.jobTitle,
          email: response.data.data.email,
          department: response.data.data.department,
          username: response.data.data.username,
        });
      } catch {
        // console.log()
      }
    })();
  }, [data]);

  const submit = async () => {
    try {
      setIsPending(true);
      const baseUrl = await getApiUrl();
      const API_URL = `${baseUrl}/api/v1/profile/${data?.user.id}`;

      const payload = {
        ...formData,
        pronouns: pronoun,
        social_links: Object.values(socialLinks),
      };

      await axios.patch(API_URL, payload, {
        headers: {
          Authorization: `Bearer ${data?.access_token}`,
        },
      });
    } catch {
      setIsPending(false);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="min-h-screen w-full max-w-[826px] bg-white p-[32px]">
      <header className="mb-[24px]">
        <h2 className="mb-[16px] text-[14px] font-medium text-[#0F172A]">
          Your photo
        </h2>
        <div className="flex items-center gap-[16px]">
          <div className="grid h-[108px] w-[108px] shrink-0 place-items-center rounded-full border-[1px] border-dashed border-[#cbd5e1] bg-[#fafafa]">
            <p className="text-[24px] font-medium">CN</p>
          </div>
          <div>
            <h3 className="mb-[8px] font-semibold text-primary">
              Upload your photo
            </h3>
            <p className="text-[#525252]">
              Photos help your teammates recognize you.
            </p>
          </div>
        </div>
      </header>
      <div className="flex flex-col gap-[24px]">
        <div className="grid gap-x-[16px] gap-y-[24px] lg:grid-cols-2">
          <CustomInput
            placeholder="Enter username"
            label="Username"
            className="border-border bg-white"
            type="text"
            name="username"
            value={formData.username}
            onChange={formDataHandler}
          />
          <div>
            <label className="mb-2 flex border-0 text-sm font-medium text-foreground">
              Pronouns
            </label>
            <Select
              value={pronoun}
              onValueChange={(value) => setPronoun(value)}
            >
              <SelectTrigger className="w-full rounded-md border border-slate-300 bg-white text-sm font-medium text-slate-700 focus:border-orange-500 focus:ring-0">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {pronouns.map((pronoun) => (
                  <SelectItem key={pronoun.value} value={pronoun.value}>
                    {pronoun.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <CustomInput
            placeholder="Enter job title"
            label="Your job title"
            className="border-border bg-white"
            type="text"
            name="jobTitle"
            value={formData.jobTitle}
            onChange={formDataHandler}
          />
          <CustomInput
            placeholder="Enter department or team"
            label="Department or team"
            className="border-border bg-white"
            type="text"
            name="department"
            value={formData.department}
            onChange={formDataHandler}
          />
        </div>
        <div>
          <CustomInput
            placeholder="Enter email address"
            label="Your email address"
            className="border-border bg-white"
            type="email"
            name="email"
            value={formData.email}
            onChange={formDataHandler}
          />
        </div>
        <div>
          <label className="mb-2 flex border-0 text-sm font-medium text-foreground">
            Bio
          </label>
          <Textarea
            name="bio"
            value={formData.bio}
            onChange={formDataHandler}
            className="resize-none bg-white"
          />
          <div className="border-b-[1px] border-b-[#e4e2e2]">
            <p className="pb-[24px] pt-2 text-[14px] text-[#64748B]">
              Maximum of 64 characters
            </p>
          </div>
        </div>
        <div>
          <h1 className="mb-[13px]">Connect Social Links</h1>
          <div className="flex flex-col gap-[16px]">
            <div className="relative">
              <XIcon className="absolute left-[8px] top-[50%] translate-y-[-50%]" />
              <input
                name="x"
                value={socialLinks.x}
                onChange={linksDataHandler}
                className="h-[40px] w-full rounded-[4px] border-[1px] border-[#cbd5e1] bg-white px-[8px] py-[12px] pl-[32px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <InstagramIcon className="absolute left-[8px] top-[50%] translate-y-[-50%]" />
              <input
                name="instagram"
                value={socialLinks.instagram}
                onChange={linksDataHandler}
                className="h-[40px] w-full rounded-[4px] border-[1px] border-[#cbd5e1] bg-white px-[8px] py-[12px] pl-[32px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div className="relative">
              <LinkedinIcon className="absolute left-[8px] top-[50%] translate-y-[-50%]" />
              <input
                name="linkedin"
                value={socialLinks.linkedin}
                onChange={linksDataHandler}
                className="h-[40px] w-full rounded-[4px] border-[1px] border-[#cbd5e1] bg-white px-[8px] py-[12px] pl-[32px] focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        </div>
        <div className="ml-auto flex w-max items-center justify-start gap-[12px]">
          <CustomButton size="lg" variant="outline">
            Cancel
          </CustomButton>
          <CustomButton
            isLoading={isPending}
            onClick={submit}
            size="lg"
            className="bg-primary"
          >
            Save Changes
          </CustomButton>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
