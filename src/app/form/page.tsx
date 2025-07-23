"use client";
import { useState } from "react";

export default function Form() {
  const [form, setForm] = useState({
    user_id: "000001",
    persona_name: "alex-morgen",
    persona_description: "this is a test persona",
    form_sections: [],
    file_uploads: [],
    global_settings: {
      default_tone: "friendly",
      default_persona_type: "adaptive",
      privacy_level: "public",
      language: "en",
    },
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("global_settings.")) {
      setForm((prev) => ({
        ...prev,
        global_settings: {
          ...prev.global_settings,
          [name.replace("global_settings.", "")]: value,
        },
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const globalsSettings: Record<string, any> = {};
    Array.from(formData.entries()).map(([key, value]) => {
      if (key.startsWith("global_settings")) {
        const newKey = key.split(".").pop() || "globals";
        globalsSettings[newKey] = value;
        formData.delete(key);
      }
    });
    formData.set("global_settings", JSON.stringify(globalsSettings));

    const formSections = [
      {
        section_id: "1111",
        section_name: "basic_information",
        is_completed: false,
        data: {
          name: "talha",
          fathername: "sifat",
          age: 21,
          profession: "programmer",
          gender: "male",
          nationality: "Pakistani",
          marital_status: "single",
          date_of_birth: "2003-05-12",
          address: "123 Main Street, Lahore",
          phone_number: "+92-300-1234567",
          email: "talha@example.com",
          hobbies: ["reading", "coding", "football"],
          languages_spoken: ["English", "Urdu"],
          education: "Bachelor's in Computer Science",
          blood_group: "B+",
          emergency_contact: {
            name: "Ali Sifat",
            relation: "father",
            phone: "+92-300-7654321",
          },
        },
        metadata: {
          content_type: "mixed",
          category: "other",
          topics: ["basic information"],
          keywords: ["biography"],
          tags: ["life"],
          importance: "high",
          confidence_level: 0.6,
          title: "users basic information",
          description: "this is some basic info about this user or persona",
          relevance_scope: [
            "when asked about user very basic info like name, age etc",
          ],
          audience_tags: ["anyone"],
          temporal_context: {},
        },
      },
      {
        section_id: "1111",
        section_name: "basic_information",
        is_completed: false,
        data: {
          name: "talha",
          fathername: "sifat",
          age: 21,
          profession: "programmer",
          gender: "male",
          nationality: "Pakistani",
          marital_status: "single",
          date_of_birth: "2003-05-12",
          address: "123 Main Street, Lahore",
          phone_number: "+92-300-1234567",
          email: "talha@example.com",
          hobbies: ["reading", "coding", "football"],
          languages_spoken: ["English", "Urdu"],
          education: "Bachelor's in Computer Science",
          blood_group: "B+",
          emergency_contact: {
            name: "Ali Sifat",
            relation: "father",
            phone: "+92-300-7654321",
          },
        },
        metadata: {
          content_type: "mixed",
          topics: ["basic information"],
          category: "other",
          keywords: ["biography"],
          tags: ["life"],
          importance: "high",
          confidence_level: 0.6,
          title: "users basic information",
          description: "this is some basic info about this user or persona",
          relevance_scope: [
            "when asked about user very basic info like name, age etc",
          ],
          audience_tags: ["anyone"],
          temporal_context: {},
        },
      },
    ];

    formData.set("form_sections", JSON.stringify(formSections));

    // Collect all file inputs by index
    const files: File[] = [];

    const fileMetadatas: any[] = [];
    let i = 0;
    while (true) {
      const file = formData.get(`file_${i}`) as File;
      if (!file) break;
      if (!file.size) {
        i++;
        continue;
      }

      // Collect metadata for this file
      const metadata = {
        title: formData.get(`file_title_${i}`),
        category: "other",
        description: formData.get(`file_description_${i}`),
        content_type: formData.get(`file_content_type_${i}`),
        topics: [formData.get(`file_topics_${i}`)],
        keywords: [formData.get(`file_keywords_${i}`)],
        time_period: formData.get(`file_time_period_${i}`),
        importance: formData.get(`file_importance_${i}`),
        tags: [formData.get(`file_tags_${i}`)],
        context_notes: formData.get(`file_context_notes_${i}`),
        temporal_context: {},
      };

      files.push(file);
      fileMetadatas.push(metadata);
      i++;
    }

    // Remove all file and metadata fields to avoid duplicates
    for (let j = 0; j < i; j++) {
      formData.delete(`file_${j}`);
      formData.delete(`file_title_${j}`);
      formData.delete(`file_description_${j}`);
      formData.delete(`file_content_type_${j}`);
      formData.delete(`file_topics_${j}`);
      formData.delete(`file_keywords_${j}`);
      formData.delete(`file_time_period_${j}`);
      formData.delete(`file_importance_${j}`);
      formData.delete(`file_tags_${j}`);
      formData.delete(`file_context_notes_${j}`);
    }
    console.log(files);

    // Append files and metadata as arrays
    if (files.length) {
      files.forEach((file) => {
        formData.append("file_uploads", file);
      });

      formData.append("file_uploads_metadata", JSON.stringify(fileMetadatas));
    }
    await fetch("/api/persona/upload", {
      method: "POST",
      body: formData,
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto mt-10 p-6 bg-white rounded shadow space-y-4 text-black"
    >
      <h1 className="text-2xl font-bold mb-4">Create Persona</h1>
      <input
        className="w-full border p-2 rounded"
        name="user_id"
        placeholder="User ID"
        value={form.user_id}
        onChange={handleChange}
        // required
      />
      <input
        className="w-full border p-2 rounded"
        name="persona_name"
        placeholder="Persona Name"
        value={form.persona_name}
        onChange={handleChange}
        // required
      />
      <textarea
        className="w-full border p-2 rounded"
        name="persona_description"
        placeholder="Persona Description"
        value={form.persona_description}
        onChange={handleChange}
      />

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Default Tone</label>
          <select
            className="w-full border p-2 rounded"
            name="global_settings.default_tone"
            value={form.global_settings.default_tone}
            onChange={handleChange}
          >
            <option value="friendly">Friendly</option>
            <option value="formal">Formal</option>
            <option value="casual">Casual</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Persona Type</label>
          <select
            className="w-full border p-2 rounded"
            name="global_settings.default_persona_type"
            value={form.global_settings.default_persona_type}
            onChange={handleChange}
          >
            <option value="adaptive">Adaptive</option>
            <option value="static">Static</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Privacy Level</label>
          <select
            className="w-full border p-2 rounded"
            name="global_settings.privacy_level"
            value={form.global_settings.privacy_level}
            onChange={handleChange}
          >
            <option value="public">Public</option>
            <option value="private">Private</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">Language</label>
          <input
            className="w-full border p-2 rounded"
            name="global_settings.language"
            value={form.global_settings.language}
            onChange={handleChange}
          />
        </div>
        {[0, 1].map((item) => (
          <div
            key={item}
            className="border rounded p-4 mt-4 space-y-3 bg-gray-50"
          >
            <h2 className="font-semibold mb-2">File Upload & Metadata</h2>
            <input
              type="file"
              name={`file_${item}`}
              id={`file_${item}`}
              className="block w-full mb-2"
            />
            <input
              className="w-full border p-2 rounded"
              name={`file_title_${item}`}
              placeholder="Title"
            />
            <textarea
              className="w-full border p-2 rounded"
              name={`file_description_${item}`}
              placeholder="Description"
            />
            <select
              className="w-full border p-2 rounded"
              name={`file_content_type_${item}`}
              defaultValue=""
            >
              <option value="" disabled>
                Select Content Type
              </option>
              <option value="narrative">Narrative</option>
              <option value="story">Story</option>
              <option value="essay">Essay</option>
              <option value="journal">Journal</option>
            </select>
            <input
              className="w-full border p-2 rounded"
              name={`file_topics_${item}`}
              placeholder="Topics (comma separated)"
            />
            <input
              className="w-full border p-2 rounded"
              name={`file_keywords_${item}`}
              placeholder="Keywords (comma separated)"
            />
            <input
              className="w-full border p-2 rounded"
              name={`file_time_period_${item}`}
              placeholder="Time Period (optional)"
            />
            <select
              className="w-full border p-2 rounded"
              name={`file_importance_${item}`}
              defaultValue=""
            >
              <option value="" disabled>
                Select Importance
              </option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              className="w-full border p-2 rounded"
              name={`file_tags_${item}`}
              placeholder="Tags (comma separated)"
            />
            <textarea
              className="w-full border p-2 rounded"
              name={`file_context_notes_${item}`}
              placeholder="Context Notes (optional)"
            />
          </div>
        ))}
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
      >
        Submit
      </button>
    </form>
  );
}
