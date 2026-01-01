"use client";

import { useState, useRef } from "react";

export default function FeedbackPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    rating: "",
    serviceType: "",
    serviceSatisfaction: "",
    wouldRecommend: "",
    areasToImprove: [],
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    message: ""
  });

  const improvementOptions = [
    "Timeliness of Service",
    "Quality of Work",
    "Communication",
    "Cleanliness",
    "Pricing",
    "Expertise",
    "Follow-up",
    "Equipment Quality"
  ];

  // Dropdown options
  const serviceTypeOptions = [
    "Lawn Maintenance",
    "Landscaping",
    "Garden Care",
    "Tree Services",
    "Irrigation Systems",
    "Seasonal Cleanup"
  ];

  const satisfactionOptions = [
    "Very Satisfied",
    "Satisfied",
    "Neutral",
    "Unsatisfied",
    "Very Unsatisfied"
  ];

  // Refs for fields
  const inputRefs = {
    name: useRef(null),
    email: useRef(null),
    serviceType: useRef(null),
    serviceSatisfaction: useRef(null),
    message: useRef(null),
  };

  // Validation functions
  const validateName = (name) => {
    if (!name.trim()) {
      return "Name is required";
    }
    if (name.trim().length < 2) {
      return "Name must be at least 2 characters long";
    }
    if (!/^[A-Za-z\s]+$/.test(name.trim())) {
      return "Name can only contain letters and spaces";
    }
    if (name.trim().length > 50) {
      return "Name cannot exceed 50 characters";
    }
    return "";
  };

  const validateEmail = (email) => {
    if (!email.trim()) {
      return "Email is required";
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return "Please enter a valid email address";
    }
    if (!email.toLowerCase().endsWith("@gmail.com")) {
      return "Only Gmail addresses are allowed (@gmail.com)";
    }
    return "";
  };

  const validateMessage = (message) => {
    if (!message.trim()) {
      return "Feedback message is required";
    }
    if (message.trim().length < 10) {
      return "Please provide at least 10 characters of feedback";
    }
    if (message.trim().length > 1000) {
      return "Feedback cannot exceed 1000 characters";
    }
    return "";
  };

  const validateForm = () => {
    const newErrors = {
      name: validateName(form.name),
      email: validateEmail(form.email),
      message: validateMessage(form.message)
    };
    
    setErrors(newErrors);
    
    // Check if all validations pass
    return !Object.values(newErrors).some(error => error !== "");
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (type === 'checkbox') {
      const { checked } = e.target;
      setForm(prev => {
        if (checked) {
          return { ...prev, [name]: [...prev[name], value] };
        } else {
          return { ...prev, [name]: prev[name].filter(item => item !== value) };
        }
      });
    } else {
      setForm({ ...form, [name]: value });
      
      // Realtime validation for specific fields
      if (name === 'name') {
        setErrors(prev => ({ ...prev, name: validateName(value) }));
      } else if (name === 'email') {
        setErrors(prev => ({ ...prev, email: validateEmail(value) }));
      } else if (name === 'message') {
        setErrors(prev => ({ ...prev, message: validateMessage(value) }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      // Scroll to first error
      const firstErrorField = Object.keys(errors).find(key => errors[key]);
      if (firstErrorField && inputRefs[firstErrorField]?.current) {
        inputRefs[firstErrorField].current.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      return;
    }
    
    setLoading(true);

    const res = await fetch("/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    
    if (res.ok) {
      setSubmitted(true);
      // Reset form after successful submission
      setTimeout(() => {
        setForm({
          name: "",
          email: "",
          rating: "",
          serviceType: "",
          serviceSatisfaction: "",
          wouldRecommend: "",
          areasToImprove: [],
          message: "",
        });
        setSubmitted(false);
        setErrors({ name: "", email: "", message: "" });
      }, 3000);
    }
    
    alert(data.message);
    setLoading(false);
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, i) => (
      <span 
        key={i} 
        className={`text-2xl ${i < rating ? 'text-yellow-500' : 'text-gray-300'}`}
      >
        ★
      </span>
    ));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl shadow-emerald-100 p-8 max-w-md text-center">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Thank You for Your Feedback!</h2>
          <p className="text-gray-600 mb-6">Your input helps us grow and improve our gardening services.</p>
          <div className="flex justify-center space-x-2">
            <div className="w-3 h-3 bg-emerald-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
            <div className="w-3 h-3 bg-emerald-600 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-10 left-10 w-32 h-32 opacity-10">
        <svg viewBox="0 0 100 100" className="text-emerald-600 w-full h-full">
          <path fill="currentColor" d="M50,10 C70,10 85,30 85,50 C85,70 70,90 50,90 C30,90 15,70 15,50 C15,30 30,10 50,10 Z" />
        </svg>
      </div>
      <div className="absolute bottom-10 right-10 w-40 h-40 opacity-10">
        <svg viewBox="0 0 100 100" className="text-green-700 w-full h-full">
          <path fill="currentColor" d="M50,10 C70,10 85,30 85,50 C85,70 70,90 50,90 C30,90 15,70 15,50 C15,30 30,10 50,10 Z" />
        </svg>
      </div>
      
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-2xl shadow-emerald-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-green-700 p-6 text-white relative overflow-hidden">
            <div className="absolute -top-6 -right-6 w-32 h-32 bg-emerald-500 rounded-full opacity-20"></div>
            <div className="relative z-10">
              <div className="flex items-center justify-center mb-4">
                <div className="bg-white/20 p-3 rounded-xl mr-4">
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path>
                  </svg>
                </div>
                <h1 className="text-3xl font-bold">Garden Services Feedback</h1>
              </div>
              <p className="text-center text-emerald-100">Help us grow by sharing your experience with our landscaping services</p>
            </div>
          </div>
          
          <div className="p-6 md:p-10">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Customer Details Section */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Customer Details
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div className="relative">
                    <div className="relative">
                      <div className="absolute -top-2 left-3 bg-white px-2 z-10">
                        <label className={`text-xs ${
                          errors.name ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          Full Name *
                        </label>
                      </div>
                      <input
                        ref={inputRefs.name}
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className={`w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all duration-200 ${
                          errors.name 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-emerald-200 focus:ring-emerald-500'
                        }`}
                        placeholder=" "
                      />
                      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                        errors.name ? 'text-red-500' : 'text-emerald-600'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                      </div>
                    </div>
                    {errors.name && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.name}
                      </div>
                    )}
                  </div>
                  
                  {/* Email Field */}
                  <div className="relative">
                    <div className="relative">
                      <div className="absolute -top-2 left-3 bg-white px-2 z-10">
                        <label className={`text-xs ${
                          errors.email ? 'text-red-600' : 'text-emerald-600'
                        }`}>
                          Email Address * (@gmail.com only)
                        </label>
                      </div>
                      <input
                        ref={inputRefs.email}
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        className={`w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all duration-200 ${
                          errors.email 
                            ? 'border-red-300 focus:ring-red-500' 
                            : 'border-emerald-200 focus:ring-emerald-500'
                        }`}
                        placeholder=" "
                      />
                      <div className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${
                        errors.email ? 'text-red-500' : 'text-emerald-600'
                      }`}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                        </svg>
                      </div>
                    </div>
                    {errors.email && (
                      <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center mt-1">
                        <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Service Details Section */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                  </svg>
                  Service Details
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  {/* Service Type - Custom Dropdown */}
                  <div className="relative">
                    <div className="absolute -top-2 left-3 bg-white px-2 z-10">
                      <label className="text-xs text-emerald-600">Service Type</label>
                    </div>
                    <div className="relative">
                      <select
                        ref={inputRefs.serviceType}
                        name="serviceType"
                        value={form.serviceType}
                        onChange={handleChange}
                        className="w-full p-4 pl-12 pr-10 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white appearance-none transition-all duration-200"
                      >
                        <option value=""></option>
                        {serviceTypeOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                        </svg>
                      </div>
                      {form.serviceType && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Service Satisfaction - Custom Dropdown */}
                  <div className="relative">
                    <div className="absolute -top-2 left-3 bg-white px-2 z-10">
                      <label className="text-xs text-emerald-600">Overall Satisfaction</label>
                    </div>
                    <div className="relative">
                      <select
                        ref={inputRefs.serviceSatisfaction}
                        name="serviceSatisfaction"
                        value={form.serviceSatisfaction}
                        onChange={handleChange}
                        className="w-full p-4 pl-12 pr-10 border border-emerald-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white appearance-none transition-all duration-200"
                      >
                        <option value=""></option>
                        {satisfactionOptions.map((option) => (
                          <option key={option} value={option}>{option}</option>
                        ))}
                      </select>
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-emerald-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                      </div>
                      {form.serviceSatisfaction && (
                        <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                          <div className="w-6 h-6 bg-emerald-500 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Rating Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Service Rating *</h3>
                  <div className="flex flex-wrap gap-4">
                    {[5, 4, 3, 2, 1].map((rating) => (
                      <div key={rating} className="flex items-center">
                        <input
                          type="radio"
                          id={`rating-${rating}`}
                          name="rating"
                          value={rating}
                          onChange={handleChange}
                          required
                          className="hidden"
                        />
                        <label
                          htmlFor={`rating-${rating}`}
                          className={`flex items-center cursor-pointer p-3 rounded-xl border-2 transition-all duration-200 ${
                            form.rating === rating.toString()
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className="flex mr-3">
                            {renderStars(rating)}
                          </div>
                          <span className="font-medium text-gray-700">{rating} Star{rating !== 1 ? 's' : ''}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Would Recommend */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Would you recommend our services? *</h3>
                  <div className="flex flex-wrap gap-4">
                    {[
                      { value: "definitely", label: "Definitely Yes" },
                      { value: "probably", label: "Probably Yes" },
                      { value: "not-sure", label: "Not Sure" },
                      { value: "probably-not", label: "Probably Not" },
                      { value: "definitely-not", label: "Definitely Not" }
                    ].map((option) => (
                      <div key={option.value} className="flex items-center">
                        <input
                          type="radio"
                          id={`recommend-${option.value}`}
                          name="wouldRecommend"
                          value={option.value}
                          onChange={handleChange}
                          required
                          className="hidden"
                        />
                        <label
                          htmlFor={`recommend-${option.value}`}
                          className={`cursor-pointer px-4 py-2 rounded-lg border-2 transition-all duration-200 ${
                            form.wouldRecommend === option.value
                              ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                              : 'border-gray-200 hover:border-emerald-300 text-gray-700'
                          }`}
                        >
                          {option.label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Areas to Improve */}
                <div>
                  <h3 className="text-lg font-medium text-gray-700 mb-4">Areas where we can improve (Select all that apply)</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {improvementOptions.map((option) => (
                      <div key={option} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`improve-${option.replace(/\s+/g, '-')}`}
                          name="areasToImprove"
                          value={option}
                          onChange={handleChange}
                          className="hidden"
                        />
                        <label
                          htmlFor={`improve-${option.replace(/\s+/g, '-')}`}
                          className={`flex items-center cursor-pointer w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                            form.areasToImprove.includes(option)
                              ? 'border-emerald-500 bg-emerald-50'
                              : 'border-gray-200 hover:border-emerald-300'
                          }`}
                        >
                          <div className={`w-5 h-5 rounded border mr-3 flex items-center justify-center ${
                            form.areasToImprove.includes(option)
                              ? 'bg-emerald-500 border-emerald-500'
                              : 'bg-white border-gray-300'
                          }`}>
                            {form.areasToImprove.includes(option) && (
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                              </svg>
                            )}
                          </div>
                          <span className="text-sm">{option}</span>
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              {/* Additional Feedback */}
              <div className="bg-emerald-50 rounded-xl p-6 border border-emerald-100">
                <h2 className="text-xl font-semibold text-emerald-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"></path>
                  </svg>
                  Additional Feedback
                </h2>
                <div className="relative">
                  <div className="relative">
                    <div className="absolute -top-2 left-3 bg-white px-2 z-10">
                      <label className={`text-xs ${
                        errors.message ? 'text-red-600' : 'text-emerald-600'
                      }`}>
                        Please share your detailed feedback *
                      </label>
                    </div>
                    <textarea
                      ref={inputRefs.message}
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      rows="4"
                      className={`w-full p-4 pl-12 border rounded-xl focus:outline-none focus:ring-2 focus:border-transparent bg-white transition-all duration-200 resize-none ${
                        errors.message 
                          ? 'border-red-300 focus:ring-red-500' 
                          : 'border-emerald-200 focus:ring-emerald-500'
                      }`}
                      placeholder=" "
                    />
                    <div className={`absolute left-4 top-6 ${
                      errors.message ? 'text-red-500' : 'text-emerald-600'
                    }`}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                      </svg>
                    </div>
                  </div>
                  {errors.message && (
                    <div className="absolute -bottom-6 left-0 text-red-500 text-sm flex items-center mt-1">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                      {errors.message}
                    </div>
                  )}
                  <div className="mt-2 text-right text-sm text-gray-500">
                    {form.message.trim().length}/1000 characters
                    {form.message.trim().length > 1000 && (
                      <span className="text-red-500 ml-2">(Exceeded limit)</span>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Submit Button */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 px-6 bg-gradient-to-r from-emerald-600 to-green-700 hover:from-emerald-700 hover:to-green-800 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Submitting Feedback...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                      </svg>
                      Submit Feedback
                    </>
                  )}
                </button>
                
                <p className="text-center text-gray-500 text-sm mt-4">
                  Your feedback helps us provide better gardening services. We appreciate your time!
                </p>
              </div>
            </form>
            
            {/* Decorative footer */}
            <div className="mt-10 pt-6 border-t border-emerald-100 flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center space-x-2 text-emerald-700 mb-4 md:mb-0">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd"></path>
                </svg>
                <span className="text-sm">Green Thumb Landscaping Services</span>
              </div>
              <div className="flex space-x-4">
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Contact:</span> feedback@gardenservices.com
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}