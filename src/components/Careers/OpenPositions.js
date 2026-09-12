"use client";
import React, { useState } from "react";
import { openPositions } from "@/data/careersData";
import JobCard from "./JobCard";
import PerksSidebar from "./PerksSidebar";
import Link from "next/link";

const DEPARTMENTS = ["All", "Sales", "Operations", "Marketing", "HR", "Others"];

export default function OpenPositions() {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedJobId, setExpandedJobId] = useState(null);

  const filteredJobs = openPositions.filter((job) => {
    if (activeTab === "All") return true;
    if (activeTab === "Others") {
      return !["Sales", "Operations", "Marketing", "HR"].includes(job.department);
    }
    return job.department === activeTab;
  });

  return (
    <section id="open-positions" className="open-positions-section">
      <div className="container th-container">
        <div className="row">
          
          {/* Main Content - Jobs */}
          <div className="col-lg-8 pe-lg-5 text-center text-lg-start">
            <span className="careers-eyebrow">Join Our Journey</span>
            <h2 className="sec-title mb-4">Open Positions</h2>
            
            <div className="job-filters justify-content-center justify-content-lg-start">
              {DEPARTMENTS.map((dept) => (
                <button 
                  key={dept} 
                  className={`filter-btn ${activeTab === dept ? 'active' : ''}`}
                  onClick={() => setActiveTab(dept)}
                >
                  {dept}
                </button>
              ))}
            </div>
            
            <div className="jobs-list">
              {filteredJobs.length > 0 ? (
                filteredJobs.map((job) => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    isExpanded={expandedJobId === job.id}
                    onToggle={() => setExpandedJobId(expandedJobId === job.id ? null : job.id)}
                  />
                ))
              ) : (
                <div className="text-center py-5">
                  <h4 className="text-muted">No open positions in {activeTab} at the moment.</h4>
                  <p>Please check back later or send us your resume at hr@tripogram.com</p>
                </div>
              )}
            </div>

            <div className="text-center mt-4">
               <Link href="mailto:hr@tripogram.com" className="btn-view-role fw-bold">
                 View All Openings <i className="fa-solid fa-arrow-right ms-2"></i>
               </Link>
            </div>
          </div>
          
          {/* Sidebar - Perks */}
          <div className="col-lg-4 mt-5 mt-lg-0">
            <PerksSidebar />
          </div>
          
        </div>
      </div>
    </section>
  );
}
