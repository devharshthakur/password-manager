/* ---------------------------------------- Add Page ------------------------------------------------ */
"use client";
import React, { useEffect, useState } from "react";
import { Checkbox, TextInput, Label, Button, Banner } from "flowbite-react";
import { FaSun } from "react-icons/fa";
import Link from "next/link";
import HeaderComponent from "@/components/header";
import axios from "axios";

const AddPage = (): JSX.Element => {
  const [label, setLabel] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleLabel = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLabel(e.target.value);
  };

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const input = { label, username, password };

    try {
      const result = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/add`, // call the backend api
        input,
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      console.log(result.data);
      setSuccess("Information added sucessfully");
      setError("");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data || "Error adding data");
        setSuccess("");
      }
    }
  };

  return (
    <>
      {/* Header */}
      <HeaderComponent />
      {/* Main Content */}
      <div className="flex h-screen justify-center items-center">
        <form
          className="w-full max-w-md flex flex-col gap-4 p-4 bg-white rounded-lg shadow"
          onSubmit={handleSubmit}
        >
          <div>
            <Label htmlFor="label">Label</Label>
            <TextInput
              id="label"
              name="label"
              type="text"
              placeholder="Your unique label"
              value={label}
              required
              shadow
              onChange={handleLabel}
            />
          </div>
          <div>
            <Label htmlFor="username">Your Username</Label>
            <TextInput
              id="username"
              name="username"
              type="text"
              placeholder="name@xyz.com"
              value={username}
              required
              shadow
              onChange={handleUsername}
            />
          </div>
          <div>
            <Label htmlFor="password">Password</Label>
            <TextInput
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              value={password}
              required
              shadow
              onChange={handlePassword}
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="agree" name="agree" />
            <Label htmlFor="agree">
              I agree with the&nbsp;
              <Link href="">
                <p className="text-cyan-600 hover:underline dark:text-cyan-500">
                  terms and conditions
                </p>
              </Link>
            </Label>
          </div>
          <Button type="submit">Add the information</Button>
          {error && <div className="text-red-500">{error}</div>}
          {success && <div className="text-green-500">{success}</div>}
        </form>
      </div>
    </>
  );
};

export default AddPage;
