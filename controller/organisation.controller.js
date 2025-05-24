// controller/user.controller.js
import Organisation from "../model/organisation.model.js";
import { sendInviteEmail } from "../email.js";
import User from "../model/user.model.js";

export const inviteUser = async (req, res) => {
  try {
    const { email } = req.body;
    const { organisationId } = req.user;  //
    console.log(req.user)

    const org = await Organisation.findById(organisationId);
    if (!org) {
      return res.status(404).json({ message: "Organisation not found" });
    }

    const inviteLink = `http://localhost:4000/register?inviteCode=${org.inviteCode}`;

    const html = `
      <h3>You've been invited to join ${org.name}</h3>
      <p>Click the link below to register:</p>
      <a href="${inviteLink}">${inviteLink}</a>
    `;

    await sendInviteEmail(email, "You're Invited to Join Our Organisation", html);

    return res.status(200).json({
      success: true,
      message: `Invite sent to ${email}`
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error sending invite", error: error.message });
  }
};


export const getAllUser = async (req, res) => {
  try {
    const { organisationId, userId } = req.user;
    console.log("Hello")

    if (!organisationId) {
      return res.status(400).json({ message: "No organization" })
    }

    const allUsersExceptMe = await User.find({
      organisationId: organisationId,
      _id: { $ne: userId } // This excludes the current user
    }).select('-password'); // Optionally exclude sensitive fields

    console.log(allUsersExceptMe)

    return res.status(200).json({
      success: true,
      data:allUsersExceptMe
    });
  } catch (error) {
    console.log(error.message);
  }
}


export const upgradeUser = async (req, res) => { 
  try {
    const userId = req.params.id;
    const { organisationId } = req.user;

    if (!organisationId) {
      return res.status(400).json({ message: "No organization" })
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = "Manager";
    await user.save();

    return res.status(200).json({
      success: true,
      message: "User upgraded to Mangager"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error upgrading user", error: error.message });
  } 
 }