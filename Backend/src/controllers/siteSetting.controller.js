import SiteSetting from "../models/siteSetting.model.js";

export const getSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();

    if (!settings) {
      settings = await SiteSetting.create({});
    }

    res.json({ success: true, settings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateSiteSettings = async (req, res) => {
  try {
    let settings = await SiteSetting.findOne();

    if (!settings) {
      settings = new SiteSetting(req.body);
    } else {
      Object.assign(settings, req.body);
    }

    const savedSettings = await settings.save();
    res.json({ success: true, settings: savedSettings });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
