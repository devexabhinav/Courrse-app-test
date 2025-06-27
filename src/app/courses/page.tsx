import { CallIcon, EmailIcon, PencilSquareIcon, UserIcon } from "@/assets/icons";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import InputGroup from "@/components/FormElements/InputGroup";
import { TextAreaGroup } from "@/components/FormElements/InputGroup/text-area";
import { ShowcaseSection } from "@/components/Layouts/showcase-section";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Courses",
};

const CoursePage = () => {
  return (
    <>
      <Breadcrumb pageName="Courses" />
      <ShowcaseSection title="Create Course" className="!p-7">
        <form>
          <div className="mb-5.5 flex flex-col gap-5.5 sm:flex-row">
            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="creator"
              label="Creator Name"
              placeholder="Add Your Name Here"
              // defaultValue="David Jhon"
              icon={<UserIcon />}
              iconPosition="left"
              height="sm"
            />

            <InputGroup
              className="w-full sm:w-1/2"
              type="text"
              name="title"
              label="Title"
              placeholder="Add Title Here"
              defaultValue={""}
              icon={<CallIcon />}
              iconPosition="left"
              height="sm"
            />
          </div>

          <InputGroup
            className="mb-5.5"
            type="text"
            name="category"
            label="Category Type"
            placeholder="Add Category Here"
            // defaultValue="devidjond45@gmail.com"
            icon={<EmailIcon />}
            iconPosition="left"
            height="sm"
          />
          {/* <ShowcaseSection title="File upload" className="space-y-5.5 !p-6.5"> */}
            <InputGroup
              type="file"
              fileStyleVariant="style1"
              label="Upload Image"
              placeholder="Upload Image "
            />
          {/* </ShowcaseSection> */}

          <TextAreaGroup
            className="mb-5.5"
            label="Description"
            placeholder="Write Description Here"
            icon={<PencilSquareIcon />}
          // defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam lacinia turpis tortor, consequat efficitur mi congue a. Curabitur cursus, ipsum ut lobortis sodales, enim arcu pellentesque lectus ac suscipit diam sem a felis. Cras sapien ex, blandit eu dui et suscipit gravida nunc. Sed sed est quis dui."
          />

          <div className="flex justify-end gap-3">
            <button
              className="rounded-lg border border-stroke px-6 py-[7px] font-medium text-dark hover:shadow-1 dark:border-dark-3 dark:text-white"
              type="button"
            >
              Cancel
            </button>

            <button
              className="rounded-lg bg-primary px-6 py-[7px] font-medium text-gray-2 hover:bg-opacity-90"
              type="submit"
            >
              Save
            </button>
          </div>
        </form>
      </ShowcaseSection>
    </>
  );
};

export default CoursePage;
