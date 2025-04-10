const applications = [
    {
        company: "Google",
        role: "SDE Intern",
        appliedDate: "2025-04-01"
    },
    {
        company: "Amazon",
        role: "SDE Intern",
        appliedDate: "2025-04-05"
    },
    {
        company: "Meta",
        role: "SDE Intern",
        appliedDate: "2025-03-28"
    }
];
  
applications.sort((a, b) => new Date(b.appliedDate) - new Date(a.appliedDate));

console.log(applications);