import { useEffect, useState } from "react";
import { useAuth } from "../../Contexts/AuthContext";
import { FiEdit, FiSave } from "react-icons/fi";

function Dashboard() {
  const { token, role, setRole,id,setId,setPHID } = useAuth();
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", email: "", role: "" });
  const [policyData,setData] = useState([])

  useEffect(() => {
    const fetchUserData = async () => {
      if (!token) return;
      try {
        const response1 = await fetch(
          "https://claims-management-system-kkd6.onrender.com/users/me",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        if (!response1.ok) throw new Error("Failed to fetch user data");
        const data1 = await response1.json();
        setId(data1.id)
        setUser(data1);
        setFormData({ name: data1.name, phone: data1.phone, email: data1.email, role: data1.role });
        setRole(data1.role);
        
        const response2 = await fetch(
          "https://claims-management-system-kkd6.onrender.com/policyholder/",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (!response2.ok) throw new Error("Failed to fetch user data");
        const data2 = await response2.json();
        const filteredData = data2.find(data => data.policyHolderId === data1.id) || {};
        setPHID(filteredData._id)
      setData(filteredData);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUserData();
  }, [token]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEdit = async () => {
    if (!token) return;
    try {
      console.log("Sending Data:", formData); // Debugging Log
      
      const response = await fetch("https://claims-management-system-kkd6.onrender.com/users/edit", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      
  
      if (!response.ok) throw new Error("Failed to update user data");
  
      const updatedData = await response.json();
      console.log("Updated Data:", updatedData); // Debugging Log
      
      setUser(updatedData);
      if (updatedData.role) setRole(updatedData.role);
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };
  
  if (!user) return <p className="text-center mt-6">Loading...</p>;

  return (
    <div className="w-full">
      <h1 className="text-center font-bold text-3xl mt-2 text-gray-800">Profile {isEditing ? (
            <button onClick={handleEdit} className="bg p-2 rounded-full text-white">
              <FiSave size={14}/>
            </button>
          ) : (
            <button onClick={() => setIsEditing(true)} className="bg p-2 rounded-full text-white">
              <FiEdit size={14} />
            </button>
          )}</h1>
      <div className="bg-white p-6 -mt-5 shadow-md w-full">
        <div className="flex justify-end">
          
        </div>
        <table className="w-1/2 border-collapse border border-gray-300 mx-auto">
          <tbody>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold w-40">Name</td>
              <td className="p-2 border border-gray-300 w-40">
                {isEditing ? <input type="text" name="name" value={formData.name} onChange={handleChange} className="border p-1" /> : user.name}
              </td>
              <td className="p-2 border border-gray-300 font-semibold">Phone</td>
              <td className="p-2 border border-gray-300 w-40">
                {isEditing ? <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="border p-1" /> : user.phone}
              </td>
             <td className="p-2 w-80">

             </td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Email</td>
              <td className="p-2 border border-gray-300">
                {isEditing ? <input type="email" name="email" value={formData.email} onChange={handleChange} className="border p-1" /> : user.email}
              </td>
              <td className="p-2 border border-gray-300 font-semibold">Role</td>
              <td className="p-2 border border-gray-300">
                {isEditing ? <input type="text" name="role" value={formData.role} onChange={handleChange} className="border p-1" /> : user.role}
              </td>
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Date Of Birth</td>
              <td className="p-2 border border-gray-300">
                { policyData.dob}
              </td>
              <td className="p-2 border border-gray-300 font-semibold">PAN Number</td>
              <td className="p-2 border border-gray-300">
                { policyData.PAN_NUMBER}
              </td>
              
            </tr>
            <tr>
              <td className="p-2 border border-gray-300 font-semibold">Address</td>
              <td className="p-2 border border-gray-300">
                { policyData.address}
              </td>
              <td className="p-2 border border-gray-300 w-40">
              </td>
              <td className="p-2 border border-gray-300 w-40">
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;